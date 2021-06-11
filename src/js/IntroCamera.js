import { Object3D, PerspectiveCamera } from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class IntroCamera {
  constructor(options) {
    // Set Options
    this.sizes = options.sizes
    this.renderer = options.renderer
    this.debug = options.debug

    // Set up
    this.container = new Object3D()
    // this.container.translateY(0.75)
    this.container.name = 'Camera'

    this.setCamera()
    this.setPosition()
    // this.setOrbitControls()
  }
  setCamera() {
    // Create camera
    this.camera = new PerspectiveCamera(
      75,
      this.sizes.viewport.width / this.sizes.viewport.height,
      0.1,
      400
    )
    this.container.add(this.camera)
    // Change camera aspect on resize
    this.sizes.on('resize', () => {
      this.camera.aspect =
        this.sizes.viewport.width / this.sizes.viewport.height
      // Call this method because of the above change
      this.camera.updateProjectionMatrix()
    })
  }
  setPosition() {
    // Set camera position
      this.camera.position.x = 30
      this.camera.position.y = 5
      this.camera.position.z = 30
      this.camera.lookAt(0,0,0)
  }
  
}
