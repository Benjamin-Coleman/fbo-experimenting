import Webgl from "./Webgl";

export default class App {
  constructor() {
    this.el = document.querySelector(".webgl");
    this._webgl = this._setupWebGL();
    this._sizes = {};
    this._update();
  }

  _setupWebGL() {
    const view = new Webgl({
      parent: this.el,
    });

    return view;
  }

  _update() {
    this._webgl.update();
    window.requestAnimationFrame(this._update.bind(this));
  }

  _setupEvents() {
    // window.addEventListener('mousemove', this._onMousemove);
    // window.addEventListener('resize', this._onResize);
    // window.addEventListener('scroll', this._onScroll);
    // window.addEventListener('mousewheel', this._onScrollWheel);
    // window.addEventListener('wheel', this._onScrollWheel);
    // this._onResize();
  }

  //   _onResize() {
  //     // const sizes = {};
  //     this.sizes.width = window.innerWidth;
  //     this.sizes.height = window.innerHeight;
  //     window.addEventListener("resize", () => {
  //       // Save sizes
  //       sizes.width = window.innerWidth;
  //       sizes.height = window.innerHeight;

  //       // Update camera
  //       camera.aspect = sizes.width / sizes.height;
  //       camera.updateProjectionMatrix();

  //       // Update renderer
  //       renderer.setSize(sizes.width, sizes.height);
  //     });
  //   }
}
