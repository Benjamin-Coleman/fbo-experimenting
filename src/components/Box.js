import * as THREE from "three";

export default class Box extends THREE.Object3D {
  constructor() {
    super();

    this._setupGeometry();
    this._setupMaterial();
    this._setupMesh();
  }

  _setupGeometry() {
    this._geometry = new THREE.BoxGeometry(10, 10, 10);
  }

  _setupMaterial() {
    this._material = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: new THREE.Color(0xffffff),
    });
  }

  _setupMesh() {
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);
  }

  // Events ----------
  //   resize(camera) {
  //     const perspectiveSize = getPerspectiveSize(camera, Math.abs(camera.position.z - this.position.z));

  //     this.scale.set(perspectiveSize.width * 1.6, perspectiveSize.height * 1.6, 1);
  //   }

  // Update -------
  update(time) {
    this._mesh.rotation.y += 0.005;
    this._mesh.rotation.z += 0.005;
  }
}
