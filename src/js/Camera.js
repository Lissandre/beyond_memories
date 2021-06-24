import { Object3D, PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class Camera {
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
    this.setOrbitControls()
  }
  setCamera() {
    // Create camera
    this.camera = new PerspectiveCamera(
      75,
      this.sizes.viewport.width / this.sizes.viewport.height,
      1.2,
      500
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
    this.camera.position.x = 0
    this.camera.position.y = 4
    this.camera.position.z = 10.5
    this.cameraUpdate(this.container.position)
  }
  cameraUpdate(position) {
    this.container.position.copy(position)
    this.camera.lookAt(this.container.position)
  }
  setOrbitControls() {
    // Set orbit control
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    )
    this.orbitControls.enabled = true
    this.orbitControls.enableKeys = true
    // this.orbitControls.zoomSpeed = 0.5
    // this.orbitControls.minDistance = 3
    // this.orbitControls.maxDistance = 4
    // this.orbitControls.enableZoom = true
    // this.orbitControls.enablePan = false
    // this.orbitControls.minPolarAngle = Math.PI / 6
    // this.orbitControls.maxPolarAngle = Math.PI / 2.7
    // this.orbitControls.enableDamping = true
    // this.orbitControls.dampingFactor = 0.05

    // this.orbitControls.target = this.world.perso.container.position

    if (this.debug) {
      this.debugFolder = this.debug.addFolder('Camera')
      this.debugFolder.open()
      this.debugFolder
        .add(this.orbitControls, 'enabled')
        .name('Enable Orbit Control')
    }
  }
}
