import * as THREE from "three";

class Interactivity {
  constructor(camera, el) {
    this.camera = camera;
    this.el = el || window;

    this.plane = new THREE.Plane();
    this.raycaster = new THREE.Raycaster();

    this.mouse = new THREE.Vector2();
    this.offset = new THREE.Vector3();
    this.intersection = new THREE.Vector3();

    this.objects = [];
    this.hovered = null;

    this.init();
  }

  init() {
    this.addListeners();
  }

  addListeners() {
    this.handlerMove = this.onMove.bind(this);

    this.el.addEventListener("mousemove", this.handlerMove);
  }

  onMove(e) {
    const t = e.touches ? e.touches[0] : e;
    const touch = { x: t.clientX, y: t.clientY };

    // this.mouse.x = ((touch.x + this.rect.x) / this.rect.width) * 2 - 1;
    // this.mouse.y = -((touch.y + this.rect.y) / this.rect.height) * 2 + 1;
    this.mouse.x = (touch.x / this.el.getBoundingClientRect().width) * 2 - 1;
    this.mouse.y = (touch.y / this.el.getBoundingClientRect().height) * 2 - 1;
    // normalized -1 to 1, y = 1 is at bottom

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.objects);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      this.intersectionData = intersects[0];

      this.plane.setFromNormalAndCoplanarPoint(
        this.camera.getWorldDirection(this.plane.normal),
        object.position
      );

      // if (this.hovered !== object) {
      // 	// this.emit('interactive-out', { object: this.hovered });
      // 	// this.emit('interactive-over', { object });
      // 	this.hovered = object;
      // }
      // else {
      // 	this.emit('interactive-move', { object, intersectionData: this.intersectionData });
      // }
    } else {
      // this.intersectionData = null;
      // if (this.hovered !== null) {
      // 	this.emit('interactive-out', { object: this.hovered });
      // 	this.hovered = null;
      // }
    }
  }
}

export default Interactivity;
