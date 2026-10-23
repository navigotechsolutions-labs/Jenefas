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
    // Drain OrbitControls' residual damping before resetting the camera.
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
      : new THREE.BoxGeometry(...part.size);
    const material = new THREE.MeshStandardMaterial({ color: '#20252c', metalness: .72, roughness: .36 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `product-${product.code}-${part.id}`;
    mesh.castShadow = mesh.receiveShadow = true;
    scene.add(mesh);
    return { mesh, part };
  });
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
    render() { controls.update(); renderer.render(scene, camera); },
    setReducedMotion(value) { reducedMotion = value; controls.enableDamping = !value; },
    dispose() {
      observer.disconnect(); controls.dispose(); canvas.removeEventListener('keydown', onKey);
      scene.traverse(object => { object.geometry?.dispose(); if (object.material) object.material.dispose(); });
      renderer.dispose(); canvas.remove();
    },
  };
}
