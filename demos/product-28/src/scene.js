import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { partPosition } from './animation.js';

export function createScene(container, product, reducedMotion) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#e9edf0');
  const camera = new THREE.PerspectiveCamera(39, 1, .1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  container.append(renderer.domElement);
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-describedby', 'view-help keyboard-help');

  // Overlay container for 2D billboarded measurement and fastener labels
  let overlay = container.querySelector('#measurement-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'measurement-overlay';
    overlay.className = 'measurement-overlay';
    overlay.setAttribute('aria-live', 'polite');
    container.append(overlay);
  }

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = !reducedMotion;
  controls.enablePan = false;
  controls.minDistance = 7;
  controls.maxDistance = 19;
  controls.minPolarAngle = .12;
  controls.maxPolarAngle = Math.PI / 2 - .03;
  controls.zoomSpeed = .7;
  const target = new THREE.Vector3(0, 2.1, .3);
  const reset = () => {
    controls.enableDamping = false;
    controls.update();
    controls.target.copy(target);
    const distance = camera.aspect < .85 ? 13.4 : 11.2;
    camera.position.copy(target).add(new THREE.Vector3(4.4, 3.1, 7).normalize().multiplyScalar(distance));
    controls.update();
    controls.enableDamping = !reducedMotion;
  };

  scene.add(new THREE.HemisphereLight(0xffffff, 0x727c8c, 3));
  const key = new THREE.DirectionalLight(0xfff4e5, 4.2);
  key.position.set(-3, 8, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: .5, far: 25 });
  key.shadow.bias = -.0003;
  key.shadow.normalBias = .025;
  key.shadow.radius = 4;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xd7e9ff, 3.8);
  rim.position.set(4, 5, -4);
  scene.add(rim);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: '#e9edf0', roughness: 1 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -.001;
  floor.receiveShadow = true;
  scene.add(floor);

  const parts = product.parts.map(part => {
    const geometry = part.shape === 'cylinder'
      ? new THREE.CylinderGeometry(part.radius, part.radius, part.height, 48)
      : new THREE.BoxGeometry(...(part.size || [1, 1, 1]));
    const material = new THREE.MeshStandardMaterial({ color: '#20252c', metalness: .72, roughness: .36 });
    let mesh;
    if (part.shape === 'vBase') {
      geometry.dispose();
      mesh = new THREE.Group();
      mesh.material = material;
      for (const sign of [-1, 1]) {
        const foot = new THREE.Mesh(new THREE.BoxGeometry(.52, .14, 2.05), material);
        foot.rotation.y = sign * .68;
        foot.position.set(sign * .64, 0, .78);
        foot.castShadow = foot.receiveShadow = true;
        mesh.add(foot);
      }
    } else mesh = new THREE.Mesh(geometry, material);
    mesh.name = `product-${product.code}-${part.id}`;
    mesh.castShadow = mesh.receiveShadow = true;
    scene.add(mesh);
    return { mesh, part };
  });

  // 3D Measurement lines and markers
  const measurementGroup = new THREE.Group();
  scene.add(measurementGroup);

  let activeMeasurement = null;
  let measurementsVisible = false;
  let measurementText = null;

  function rebuildMeasurement3D() {
    while (measurementGroup.children.length > 0) {
      const child = measurementGroup.children.pop();
      child.geometry?.dispose();
      if (child.material) child.material.dispose();
    }
    const existingBadge = overlay.querySelector('.measurement-overlay-badge');
    if (existingBadge) existingBadge.remove();

    if (!measurementsVisible || !activeMeasurement) return;

    const hasValue = activeMeasurement.value !== null || (activeMeasurement.min !== null && activeMeasurement.max !== null);
    if (!hasValue || !activeMeasurement.points || activeMeasurement.points.length < 2) {
      // Unverified measurement: DO NOT draw dimension arrows with invented values
      const pendingBadge = document.createElement('div');
      pendingBadge.className = 'measurement-overlay-badge pending';
      const name = measurementText?.[activeMeasurement.nameKey] || activeMeasurement.id;
      const pendingLabel = measurementText?.statusPendingLabel || 'Measurement pending';
      pendingBadge.innerHTML = `<span class="badge-icon" aria-hidden="true">⏳</span> <span class="badge-title">${name}:</span> <span class="badge-val">${pendingLabel}</span>`;
      overlay.append(pendingBadge);
      return;
    }

    // Verified measurement with defined coordinates
    const p1 = new THREE.Vector3(...activeMeasurement.points[0]);
    const p2 = new THREE.Vector3(...activeMeasurement.points[1]);

    const lineGeom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xdc2626, depthTest: false, linewidth: 2 });
    const line = new THREE.Line(lineGeom, lineMat);
    line.renderOrder = 1000;
    measurementGroup.add(line);

    const markerMat = new THREE.MeshBasicMaterial({ color: 0xdc2626, depthTest: false });
    for (const pt of [p1, p2]) {
      const markerGeom = new THREE.SphereGeometry(0.045, 16, 16);
      const markerMesh = new THREE.Mesh(markerGeom, markerMat);
      markerMesh.position.copy(pt);
      markerMesh.renderOrder = 1001;
      measurementGroup.add(markerMesh);
    }

    const verifiedBadge = document.createElement('div');
    verifiedBadge.className = 'measurement-overlay-badge verified';
    const name = measurementText?.[activeMeasurement.nameKey] || activeMeasurement.id;
    const valText = activeMeasurement.min !== null && activeMeasurement.max !== null
      ? `${activeMeasurement.min} – ${activeMeasurement.max} ${activeMeasurement.unit || 'mm'}`
      : `${activeMeasurement.value} ${activeMeasurement.unit || 'mm'}`;
    verifiedBadge.innerHTML = `<span class="badge-title">${name}:</span> <strong class="badge-val">${valText}</strong>`;
    overlay.append(verifiedBadge);
  }

  function updateMeasurementOverlay() {
    if (!measurementsVisible || !activeMeasurement) return;
    const badge = overlay.querySelector('.measurement-overlay-badge.verified');
    if (badge && activeMeasurement.points && activeMeasurement.points.length >= 2) {
      const p1 = new THREE.Vector3(...activeMeasurement.points[0]);
      const p2 = new THREE.Vector3(...activeMeasurement.points[1]);
      const midpoint = p1.clone().add(p2).multiplyScalar(0.5);
      midpoint.project(camera);
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width && height && midpoint.z < 1) {
        const x = (midpoint.x * 0.5 + 0.5) * width;
        const y = (-midpoint.y * 0.5 + 0.5) * height;
        badge.style.transform = 'translate(-50%, -50%)';
        badge.style.left = `${Math.round(x)}px`;
        badge.style.top = `${Math.round(y)}px`;
        badge.style.display = 'block';
      } else {
        badge.style.display = 'none';
      }
    }
  }

  // 3D Fastener Highlight markers
  const fastenerGroup = new THREE.Group();
  scene.add(fastenerGroup);

  let activeFastener = null;
  let fastenerText = null;

  function rebuildFastener3D() {
    while (fastenerGroup.children.length > 0) {
      const child = fastenerGroup.children.pop();
      child.geometry?.dispose();
      if (child.material) child.material.dispose();
    }
    const existingFastenerBadge = overlay.querySelector('.fastener-overlay-badge');
    if (existingFastenerBadge) existingFastenerBadge.remove();

    if (!activeFastener) return;

    // Require formal source reference and recorded manufacturer approval
    const isApproved = Boolean(
      activeFastener.approved === true &&
      activeFastener.source &&
      Array.isArray(activeFastener.location) &&
      activeFastener.location.length === 3
    );

    const name = fastenerText?.[activeFastener.nameKey] || activeFastener.id;
    if (!isApproved) {
      // Unverified connection or unconfirmed location:
      // Strictly do NOT draw invented screw positions or connection methods!
      const pendingBadge = document.createElement('div');
      pendingBadge.className = 'fastener-overlay-badge pending';
      const pendingNotice = fastenerText?.fastenerLocationPending || 'Pending manufacturer verification';
      pendingBadge.innerHTML = `<span class="badge-icon" aria-hidden="true">🔩</span> <span class="badge-title"><strong>${activeFastener.id}</strong> (${name}):</span> <span class="badge-val">${pendingNotice}</span>`;
      overlay.append(pendingBadge);
      return;
    }

    // Verified location with confirmed coordinates and recorded approval
    const pos = new THREE.Vector3(...activeFastener.location);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0xdc2626, depthTest: false });
    const markerGeom = new THREE.SphereGeometry(0.065, 16, 16);
    const marker = new THREE.Mesh(markerGeom, markerMat);
    marker.position.copy(pos);
    marker.renderOrder = 1005;
    fastenerGroup.add(marker);

    const ringGeom = new THREE.RingGeometry(0.1, 0.14, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xfff4e5, side: THREE.DoubleSide, depthTest: false });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.position.copy(pos);
    ring.renderOrder = 1006;
    fastenerGroup.add(ring);

    const verifiedBadge = document.createElement('div');
    verifiedBadge.className = 'fastener-overlay-badge verified';
    verifiedBadge.innerHTML = `<span class="badge-icon">📍</span> <strong>${activeFastener.id}</strong>: <span>${name}</span>`;
    overlay.append(verifiedBadge);
  }

  function updateFastenerOverlay() {
    const isApproved = Boolean(
      activeFastener &&
      activeFastener.approved === true &&
      activeFastener.source &&
      Array.isArray(activeFastener.location) &&
      activeFastener.location.length === 3
    );
    if (isApproved) {
      const badge = overlay.querySelector('.fastener-overlay-badge.verified');
      if (badge) {
        const pos = new THREE.Vector3(...activeFastener.location);
        pos.project(camera);
        const width = container.clientWidth;
        const height = container.clientHeight;
        if (width && height && pos.z < 1) {
          const x = (pos.x * 0.5 + 0.5) * width;
          const y = (-pos.y * 0.5 + 0.5) * height;
          badge.style.transform = 'translate(-50%, -130%)';
          badge.style.left = `${Math.round(x)}px`;
          badge.style.top = `${Math.round(y)}px`;
          badge.style.display = 'block';
        } else {
          badge.style.display = 'none';
        }
      }
    }
  }

  let lastProgress = -1;
  let lastActive = -1;
  function setProgress(progress, active) {
    if (progress === lastProgress && active === lastActive) return;
    lastProgress = progress;
    lastActive = active;
    parts.forEach(({ mesh, part }, index) => {
      mesh.position.fromArray(partPosition(part, progress));
      const highlighted = index + 1 === active;
      mesh.material.color.set(highlighted ? '#a94d1a' : '#20252c');
      mesh.material.emissive.set(highlighted ? '#512006' : '#000000');
      mesh.material.emissiveIntensity = .25;
    });
  }

  let previousAspect = 0;
  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    if (!previousAspect || (previousAspect < .85) !== (camera.aspect < .85)) reset();
    previousAspect = camera.aspect;
  };
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  function onKey(event) {
    const turns = { ArrowLeft: [-.09, 0], ArrowRight: [.09, 0], ArrowUp: [0, -.09], ArrowDown: [0, .09] };
    if (!turns[event.key] && !['+', '=', '-', '_', 'Home'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') { reset(); return; }
    const offset = camera.position.clone().sub(controls.target);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    if (turns[event.key]) {
      spherical.theta += turns[event.key][0];
      spherical.phi = THREE.MathUtils.clamp(spherical.phi + turns[event.key][1], controls.minPolarAngle, controls.maxPolarAngle);
    } else {
      spherical.radius = THREE.MathUtils.clamp(spherical.radius * (['+', '='].includes(event.key) ? .9 : 1.1), controls.minDistance, controls.maxDistance);
    }
    camera.position.copy(controls.target).add(offset.setFromSpherical(spherical));
    controls.update();
  }
  canvas.addEventListener('keydown', onKey);
  setProgress(0, 0);

  return {
    canvas, reset, setProgress,
    setMeasurement(measurement, visible, text) {
      activeMeasurement = measurement;
      measurementsVisible = !!visible;
      measurementText = text;
      rebuildMeasurement3D();
    },
    setFastenerHighlight(fastener, text) {
      activeFastener = fastener;
      fastenerText = text;
      rebuildFastener3D();
    },
    render() {
      controls.update();
      renderer.render(scene, camera);
      updateMeasurementOverlay();
      updateFastenerOverlay();
    },
    setReducedMotion(value) { reducedMotion = value; controls.enableDamping = !value; },
    dispose() {
      observer.disconnect();
      controls.dispose();
      canvas.removeEventListener('keydown', onKey);
      scene.traverse(object => { object.geometry?.dispose(); if (object.material) object.material.dispose(); });
      renderer.dispose();
      overlay.remove();
      canvas.remove();
    },
  };
}
