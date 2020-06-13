import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Box from "./Box";
import Particles from "./Particles";

export default class Webgl {
  constructor(options) {
    this._el = options.parent;
    this._setupWebGL(window.innerWidth, window.innerHeight);
    this._addEvents();
    this._setupControls();
    // this._setupBox();
    this._setupParticles();
  }

  _setupWebGL(width, height) {
    console.log("w:", width, "h: ", height);
    this._scene = new THREE.Scene();

    this._camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
    this._camera.position.z = 500;

    // this._controls = new OrbitControls(this._camera);

    this._renderer = new THREE.WebGLRenderer({
      canvas: this._el,
    });
    this._renderer.setSize(width, height);
    this._renderer.setClearColor(0x000000);
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._addEvents();
    this._onResize();
  }

  _addEvents() {
    window.addEventListener("resize", this._onResize.bind(this));
  }

  _setupControls() {
    this._controls = new OrbitControls(this._camera, this._el);
  }

  _onResize() {
    const sizes = {};
    // Save sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    this._camera.aspect = sizes.width / sizes.height;
    this._camera.updateProjectionMatrix();

    // Update renderer
    this._renderer.setSize(sizes.width, sizes.height);
  }

  // just used for testing
  _setupBox() {
    this._box = new Box();
    this._box.position.z = 450;
    this._scene.add(this._box);
  }

  _setupParticles() {
    this._particles = new Particles({
      renderer: this._renderer,
      width: 256,
      height: 256,
    });
    // this._particles.getObject().position.z = -2000;
    this._scene.add(this._particles.getParticles());
  }

  update() {
    if (this._box) this._box.update();
    this._renderer.render(this._scene, this._camera);
    this._controls.update();
    this._particles.update();
  }
}
