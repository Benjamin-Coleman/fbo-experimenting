import * as THREE from "three";

class FBO {
  constructor(width, height, renderer, simulationMaterial, renderMaterial) {
    // gl = renderer.getContext();

    // //1 we need FLOAT Textures to store positions
    // //https://github.com/KhronosGroup/WebGL/blob/master/sdk/tests/conformance/extensions/oes-texture-float.html
    // if (!gl.getExtension("OES_texture_float")) {
    //   throw new Error("float textures not supported");
    // }

    // //2 we need to access textures from within the vertex shader
    // //https://github.com/KhronosGroup/WebGL/blob/90ceaac0c4546b1aad634a6a5c4d2dfae9f4d124/conformance-suites/1.0.0/extra/webgl-info.html
    // if (gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) == 0) {
    //   throw new Error("vertex shader cannot read textures");
    // }

    // setting up render target
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(
      -1,
      1,
      1,
      -1,
      1 / Math.pow(2, 53),
      1
    );
    //4 create a target texture
    const options = {
      minFilter: THREE.NearestFilter, //important as we want to sample square pixels
      magFilter: THREE.NearestFilter, //
      format: THREE.RGBFormat, //could be RGBAFormat
      type: THREE.FloatType, //important as we need precise coordinates (not ints)
    };
    this.renderTarget = new THREE.WebGLRenderTarget(width, height, options);
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array([
          -1,
          -1,
          0,
          1,
          -1,
          0,
          1,
          1,
          0,
          -1,
          -1,
          0,
          1,
          1,
          0,
          -1,
          1,
          0,
        ]),
        3
      )
    );
    this.geometry.setAttribute(
      "uv",
      new THREE.BufferAttribute(
        new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]),
        2
      )
    );
    this.scene.add(new THREE.Mesh(this.geometry, simulationMaterial));

    const length = width * height;
    const vertices = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      let i3 = i * 3;
      vertices[i3] = (i % width) / width;
      vertices[i3 + 1] = i / width / height;
    }

    this.particleGeometry = new THREE.BufferGeometry();
    this.particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(vertices, 3)
    );

    console.log("fbo: ", this, renderer);
    this.renderer = renderer;
    this.particles = new THREE.Points(this.particleGeometry, renderMaterial);
  }

  getTexture() {
    return this.renderTarget.texture;
  }

  update() {
    //1 update the simulation and render the result in a target texture
    // this.renderer.render(this.scene, this.camera, this.renderTarget, true);
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(null);

    //2 use the result of the swap as the new position for the particles' renderer
    this.particles.material.uniforms.positions.value = this.renderTarget.texture;
  }
}

export default FBO;
