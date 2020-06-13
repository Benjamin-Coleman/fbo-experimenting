import * as THREE from "three";
import FBO from "./Fbo";
import simulationFs from "../shaders/simulation.fs";
import simulationVs from "../shaders/simulation.vs";
import renderVs from "../shaders/render.vs";
import renderFs from "../shaders/render.fs";

class Particles extends THREE.Object3D {
  constructor(options) {
    super();
    // maybe should just be Object3d, not sure
    this._object = new THREE.Points();
    this.fbo = null;
    this.width = 256;
    this.height = 256;
    this.data = this.getRandomData(this.width, this.height, 256);
    this.positions = new THREE.DataTexture(
      this.data,
      this.width,
      this.height,
      THREE.RGBFormat,
      THREE.FloatType
    );
    this.positions.needsUpdate = true;
    this.dataA = this.getSphere(this.width * this.height, 128);
    this.textureA = new THREE.DataTexture(
      this.dataA,
      this.width,
      this.height,
      THREE.RGBFormat,
      THREE.FloatType,
      THREE.DEFAULT_MAPPING,
      THREE.RepeatWrapping,
      THREE.RepeatWrapping
    );
    this.textureA.needsUpdate = true;
    // this.dataB = this.getSphere(this.width * this.height, 128);
    this.dataB = this.data;
    this.textureB = new THREE.DataTexture(
      this.dataB,
      this.width,
      this.height,
      THREE.RGBFormat,
      THREE.FloatType,
      THREE.DEFAULT_MAPPING,
      THREE.RepeatWrapping,
      THREE.RepeatWrapping
    );
    this.textureB.needsUpdate = true;
    this.simulationShader = new THREE.ShaderMaterial({
      uniforms: {
        positions: { type: "t", value: this.positions },
        textureA: { type: "t", value: this.textureA },
        textureB: { type: "t", value: this.textureB },
        timer: { type: "f", value: 0.0 },
        frequency: { type: "f", value: 1.0 },
        amplitude: { type: "f", value: 48.0 },
        maxDistance: { type: "f", value: 10.0 },
      },
      vertexShader: simulationVs,
      fragmentShader: simulationFs,
    });
    this.renderShader = new THREE.ShaderMaterial({
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
    this.renderer = options.renderer;
    this.initFbo();
  }

  getRandomData(width, height, size) {
    var len = width * height * 3;
    var data = new Float32Array(len);
    while (len--) data[len] = (Math.random() - 0.5) * size;
    return data;
  }

  //returns a Float32Array buffer of spherical 3D points
  getPoint(v, size) {
    v.x = Math.random() * 2 - 1;
    v.y = Math.random() * 2 - 1;
    v.z = Math.random() * 2 - 1;
    if (v.length() > 1) return this.getPoint(v, size);
    return v.normalize().multiplyScalar(size);
  }

  getSphere(count, size) {
    var len = count * 3;
    var data = new Float32Array(len);
    var p = new THREE.Vector3();
    for (var i = 0; i < len; i += 3) {
      this.getPoint(p, size);
      data[i] = p.x;
      data[i + 1] = p.y;
      data[i + 2] = p.z;
    }
    return data;
  }

  initFbo() {
    console.log("init fbo", this.renderer);
    this.fbo = new FBO(
      this.width,
      this.height,
      this.renderer,
      this.simulationShader,
      this.renderShader
    );
    // this.scene.add(this.fbo.particles);
  }

  getParticles() {
    console.log("particles", this.fbo.particles);
    return this.fbo.particles;
  }

  update() {
    // Render
    // this.renderer.render(this.scene, this.camera);
    // controls.update();
    this.simulationShader.uniforms.timer.value += 0.01;
    this.fbo.particles.rotation.y -= (Math.PI / 180) * 0.1;
    this.fbo.update();
    // if (touchTexture) touchTexture.update();
    // Keep looping
    // window.requestAnimationFrame(this.loop);
  }
}

export default Particles;
