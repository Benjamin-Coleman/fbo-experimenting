import "./style/main.css";
import * as THREE from "three";
import FBO from "./components/Fbo";
import Particles from "./components/Particles";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Interactivity from "./components/Interactivity";
import TouchTexture from "./components/TouchTexture";
import App from "./components/App";

class Main {
  constructor() {
    const styles = [
      "background: linear-gradient(#FC466B, #3F5EFB)",
      "border: 1px solid #00ff00",
      "color: white",
      "display: block",
      "line-height: 20px",
      "text-align: center",
      "font-weight: bold",
    ].join(";");

    console.log("%c Lets get it", styles);
    this.app = new App();
  }
}

// could be behind domready or loader or soemthing
const main = new Main();

// const controls = new OrbitControls(camera, document.querySelector(".webgl"));

// const interactivity = new Interactivity(camera, renderer.domElement);
// const touchTexture = new TouchTexture();
// const particles = new Particles(renderer, scene, camera);
// scene.add(particles.getParticles);
// particles.loop(renderer, scene, camera);
