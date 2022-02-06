import * as THREE from 'three';
import gsap from "gsap";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import fragment from './shader/fragment.glsl';
import vertex from './shader/vertex.glsl';
import texture1 from '../img1.jpg';
import texture2 from '../img2.jpg';
import texture3 from '../img3.jpg';
import texture4 from '../img4.jpg';


const loader = new THREE.TextureLoader();

let gallery = [
  loader.load(texture1),
  loader.load(texture2),
  loader.load(texture3),
  loader.load(texture4)
];

let camera, pos, controls, scene, renderer, geometry, geometry1, material,plane,tex1,tex2;
let destination = {x:0,y:0};
let textures = [];

function init() {
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerWidth);

  var container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.001, 100
  );
  camera.position.set( 0, 0, 1 );

  material = new THREE.ShaderMaterial( {
    side: THREE.DoubleSide,
    uniforms: {
      time: { type: 'f', value: 0 },
      pixels: {type: 'v2', value: new THREE.Vector2(window.innerWidth,window.innerHeight)},
      accel: {type: 'v2', value: new THREE.Vector2(0.5,2)},
      progress: {type: 'f', value: 0},
      uvRate1: {
        value: new THREE.Vector2(1,1)
      },
      texture1: {
        value: loader.load(texture1)
      },
      texture2: {
        value: loader.load(texture2)
      },
    },
    vertexShader: vertex,
    fragmentShader: fragment
  });

  plane = new THREE.Mesh(new THREE.PlaneGeometry( 1,1, 1, 1 ),material);
  scene.add(plane);

  resize();
}

window.addEventListener('resize', resize); 
function resize() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  renderer.setSize( w, h );
  camera.aspect = w / h;

  material.uniforms.uvRate1.value.y = h / w;

  let dist  = camera.position.z - plane.position.z;
  let height = 1;
  camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*dist));

  plane.scale.x = w/h;

  camera.updateProjectionMatrix();
}

let time = 0;
function animate() {
  time = time+0.05;
  material.uniforms.time.value = time;
  
  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
}

init();
animate();

let tl = gsap.timeline();

let speed = 0;
let position = 0;
document.addEventListener('wheel',function(event) {
  speed += event.deltaY*0.00035;
});

let tl1 = gsap.timeline();
function animation() {
  position += speed;
  speed *=0.7;

  let i = Math.round(position);
  let dif = i - position;

  position += dif*0.035;
  if(Math.abs(i - position)<0.001) {
    position = i;
  }

  tl1.set('.dot',{y:position*200});
  material.uniforms.progress.value = position;

  let curslide = (Math.floor(position) - 1 + gallery.length)%gallery.length;
  let nextslide = (((Math.floor(position) + 1)%gallery.length -1) + gallery.length)%gallery.length;
  console.log(curslide,nextslide);
  material.uniforms.texture1.value = gallery[curslide];
  material.uniforms.texture2.value = gallery[nextslide];

  window.requestAnimationFrame(raf);
}

animation();






