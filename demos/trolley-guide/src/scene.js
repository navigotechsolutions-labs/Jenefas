import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { shelfMotion } from './shelf-motion.js';
export function createScene(container) {
 const scene=new THREE.Scene(); scene.background=new THREE.Color(0x111722);
 const camera=new THREE.PerspectiveCamera(38,1,.1,100); camera.position.set(5,4,7);
 const renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.shadowMap.enabled=true; container.append(renderer.domElement);
 const controls=new OrbitControls(camera,renderer.domElement); controls.target.set(0,1.5,0); controls.enableDamping=true; controls.maxPolarAngle=Math.PI/2.05; controls.minDistance=3; controls.maxDistance=14;
 scene.add(new THREE.HemisphereLight(0xe1edff,0x20232a,2)); const light=new THREE.DirectionalLight(0xffffff,3); light.position.set(4,8,5); scene.add(light);
 const metal=new THREE.MeshStandardMaterial({color:0x303741,metalness:.7,roughness:.38}), black=new THREE.MeshStandardMaterial({color:0x141920,metalness:.4,roughness:.55}), yellow=new THREE.MeshStandardMaterial({color:0xeab308});
 const groups=Array.from({length:7},()=>new THREE.Group()); groups.forEach(g=>scene.add(g));
 function box(g,w,h,d,x,y,z,mat=metal){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);g.add(m);return m}
 function cylinder(g,r,h,x,y,z,mat=metal){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,20),mat);m.position.set(x,y,z);g.add(m);return m}
 for(const x of [-1,1]) for(const z of [-.72,.72]){cylinder(groups[0],.07,.13,x,.23,z);const w=cylinder(groups[0],.13,.1,x,.12,z,black);w.rotation.z=Math.PI/2;}
 // Four splayed base arms, approximated from the workshop footage.
 box(groups[1],1.02,.12,.16,0,.34,0);
 for(const x of [-1,1]) for(const z of [-.72,.72]){
  const from=new THREE.Vector3(x*.48,.34,0),to=new THREE.Vector3(x,.34,z),delta=to.clone().sub(from);
  const arm=box(groups[1],.14,.12,delta.length(),(from.x+to.x)/2,.34,(from.z+to.z)/2);
  arm.rotation.y=Math.atan2(delta.x,delta.z);
 }

 for(const x of [-.48,.48]){cylinder(groups[2],.075,2.35,x,1.58,0); for(const y of [1.85,2.12]){const pin=cylinder(groups[2],.025,.17,x,y,.075,yellow);pin.rotation.x=Math.PI/2;}}
 box(groups[3],1.1,.12,.12,0,.8,0);
 // Separate schematic support and plate allow the visible sequence to be scrubbed.
 const shelfSupport=new THREE.Group(),shelfPlate=new THREE.Group();groups[4].add(shelfSupport,shelfPlate);
 box(shelfSupport,1.12,.1,.1,0,1.06,.02);
 for(const x of [-.48,.48]) { box(shelfSupport,.09,.09,.65,x,1.06,.34);box(shelfSupport,.16,.14,.16,x,1.06,0); }
 box(shelfPlate,1.35,.08,.72,0,1.145,.34);

 box(groups[5],1.65,.25,.1,0,2.62,0);const cv=document.createElement('canvas');cv.width=512;cv.height=96;const ctx=cv.getContext('2d');ctx.fillStyle='#eab308';ctx.font='bold 55px sans-serif';ctx.textAlign='center';ctx.fillText('jenefas.com',256,66);const label=new THREE.Mesh(new THREE.PlaneGeometry(.75,.14),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true}));label.position.set(0,2.62,.052);groups[5].add(label);
 const rails=[];for(const x of [-.4,.4]){const rail=new THREE.Group();box(rail,.09,1.05,.08,x,2.52,.08);groups[6].add(rail);rails.push(rail)} const tv=new THREE.Group();box(tv,2.15,1.2,.08,0,2.5,.18,black);box(tv,2.03,1.08,.01,0,2.5,.23,new THREE.MeshStandardMaterial({color:0x283746,roughness:.2}));groups[6].add(tv);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.MeshStandardMaterial({color:0x1b222d,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.025;scene.add(ground);
 const starts=[new THREE.Vector3(0,-.8,0),new THREE.Vector3(0,-.6,0),new THREE.Vector3(0,1.8,0),new THREE.Vector3(-2,0,0),new THREE.Vector3(2,0,0),new THREE.Vector3(0,1.5,0),new THREE.Vector3(0,0,2.5)];
 const shots=[
  {position:[3.7,2.4,5.4],target:[0,.5,0]},
  {position:[4.4,3.1,5.8],target:[0,.65,0]},
  {position:[4.4,3.7,6.2],target:[0,1.4,0]},
  {position:[-4,3.1,6],target:[0,1.1,0]},
  {position:[2.7,2.25,4],target:[0,1.15,.25]},
  {position:[-3.7,3.7,5.8],target:[0,2,0]},
  {position:[4.8,4,7.4],target:[0,1.55,0]}
 ];
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let auto=true;controls.addEventListener('start',()=>auto=false);
 function update(time,showTV,playing){
  groups.forEach((g,i)=>{const p=THREE.MathUtils.clamp((time-i*6)/4,0,1);const e=p*p*(3-2*p);g.position.copy(starts[i]).multiplyScalar(1-e);g.visible=time>=i*6;});
  const shelf=shelfMotion(time);groups[4].position.set(0,0,0);groups[4].visible=shelf.visible;shelfSupport.position.z=shelf.supportOffset;shelfPlate.visible=shelf.plateVisible;shelfPlate.position.y=shelf.plateHeight;
  // Rails arrive independently; the optional TV is a separate illustration.
  groups[6].position.set(0,0,0);
  rails.forEach((rail,i)=>{const t=THREE.MathUtils.smoothstep((time-36-i*.7)/2,0,1);rail.position.set((i===0?-1:1)*(1-t),0,1.2*(1-t));});
  tv.visible=showTV && time>=39;tv.position.z=1.1*(1-THREE.MathUtils.smoothstep((time-39)/2,0,1));
  if(auto && playing && !motion.matches){
   const index=Math.min(6,Math.floor(time/6)), next=Math.min(6,index+1);
   const blend=THREE.MathUtils.smoothstep((time%6)/6,.55,1);
   const a=shots[index],b=shots[next];
   const pos=new THREE.Vector3(...a.position).lerp(new THREE.Vector3(...b.position),blend);
   const aim=new THREE.Vector3(...a.target).lerp(new THREE.Vector3(...b.target),blend);
   camera.position.lerp(pos,.035);controls.target.lerp(aim,.035);
  }
  controls.update();renderer.render(scene,camera)
 }
 function resize(){const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}new ResizeObserver(resize).observe(container);resize();
 return {update,reset(){camera.position.set(5,4,7);controls.target.set(0,1.5,0);auto=true;controls.update()}};
}
