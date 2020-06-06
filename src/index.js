import "./style/main.css";
import * as THREE from "three";
import FBO from "./components/Fbo";
import simulationFs from "./shaders/simulation.fs";
import simulationVs from "./shaders/simulation.vs";
import renderVs from "./shaders/render.vs";
import renderFs from "./shaders/render.fs";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Interactivity from "./components/Interactivity";
import TouchTexture from "./components/TouchTexture";

/**
 * Sizes
 */
const sizes = {};
sizes.width = window.innerWidth;
sizes.height = window.innerHeight;

window.addEventListener("resize", () => {
  // Save sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});

/**
 * Environnements
 */
// Scene
const scene = new THREE.Scene();

// Camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
const camera = new THREE.PerspectiveCamera(
  60,
  sizes.width / sizes.height,
  1,
  10000
);
camera.position.z = 500;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".webgl"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);

const controls = new OrbitControls(camera, document.querySelector(".webgl"));

const interactivity = new Interactivity(camera, renderer.domElement);
const touchTexture = new TouchTexture();

//width / height of the FBO

const width = 256;
const height = 256;

//populate a Float32Array of random positions

function getRandomData(width, height, size) {
  var len = width * height * 3;
  var data = new Float32Array(len);
  while (len--) data[len] = (Math.random() - 0.5) * size;
  return data;
}

const data = getRandomData(width, height, 256);
const positions = new THREE.DataTexture(
  data,
  width,
  height,
  THREE.RGBFormat,
  THREE.FloatType
);
positions.needsUpdate = true;

//returns a Float32Array buffer of spherical 3D points
function getPoint(v, size) {
  v.x = Math.random() * 2 - 1;
  v.y = Math.random() * 2 - 1;
  v.z = Math.random() * 2 - 1;
  if (v.length() > 1) return getPoint(v, size);
  return v.normalize().multiplyScalar(size);
}
function getSphere(count, size) {
  var len = count * 3;
  var data = new Float32Array(len);
  var p = new THREE.Vector3();
  for (var i = 0; i < len; i += 3) {
    getPoint(p, size);
    data[i] = p.x;
    data[i + 1] = p.y;
    data[i + 2] = p.z;
  }
  return data;
}

//this will be used to update the particles' positions
//first model
var dataA = getRandomData(width, height, 256);
var textureA = new THREE.DataTexture(
  dataA,
  width,
  height,
  THREE.RGBFormat,
  THREE.FloatType,
  THREE.DEFAULT_MAPPING,
  THREE.RepeatWrapping,
  THREE.RepeatWrapping
);
textureA.needsUpdate = true;

//second model
var dataB = getSphere(width * height, 128);
var textureB = new THREE.DataTexture(
  dataB,
  width,
  height,
  THREE.RGBFormat,
  THREE.FloatType,
  THREE.DEFAULT_MAPPING,
  THREE.RepeatWrapping,
  THREE.RepeatWrapping
);
textureB.needsUpdate = true;

const simulationShader = new THREE.ShaderMaterial({
  uniforms: {
    positions: { type: "t", value: positions },
    textureA: { type: "t", value: textureA },
    textureB: { type: "t", value: textureB },
    timer: { type: "f", value: 0.0 },
    frequency: { type: "f", value: 1.0 },
    amplitude: { type: "f", value: 48.0 },
    maxDistance: { type: "f", value: 10.0 },
  },
  vertexShader: simulationVs,
  fragmentShader: simulationFs,
});

//this will be used to represent the particles on screen
//note that 'positions' is a texture that will be set and updated during the FBO.update() call
const renderShader = new THREE.ShaderMaterial({
  uniforms: {
    positions: { type: "t", value: null },
    pointSize: { type: "f", value: 2 },
  },
  vertexShader: renderVs,
  fragmentShader: renderFs,
  transparent: true,
  side: THREE.DoubleSide,
  //   blending: THREE.AdditiveBlending,
});

// FBO
const fbo = new FBO(width, height, renderer, simulationShader, renderShader);
scene.add(fbo.particles);

/**
 * Loop
 */
const loop = () => {
  // Render
  renderer.render(scene, camera);
  controls.update();
  simulationShader.uniforms.timer.value += 0.01;
  fbo.particles.rotation.y -= (Math.PI / 180) * 0.1;
  fbo.update();
  if (this.touch) this.touch.update();

  // Keep looping
  window.requestAnimationFrame(loop);
};
loop();
