import { Object3D, PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class IntroCam {
  constructor(options) {
    // Set Options
    this.sizes = options.sizes
    this.renderer = options.renderer
    this.debug = options.debug

    // Set up
    this.container = new Object3D()
    // this.container.translateY(0.75)
    this.container.name = 'Intro cam'

    this.setCamera()
    this.setPosition()
    // this.setOrbitControls()
    if(this.debug) {
      this.setDebug()
    }
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
    this.camera.position.x = 64.3
    this.camera.position.y = 25.8
    this.camera.position.z = 7.2

    this.camera.rotation.x = 5.5556
    this.camera.rotation.y = 1.239
    this.camera.rotation.z = 0.628
    // this.cameraUpdate(this.container.position)
  }
  cameraUpdate(position) {
    this.container.position.copy(position)
    this.camera.lookAt(this.container.position)
  }

  setDebug() {
    this.debugFolder = this.debug.addFolder('IntroCam')
      this.debugFolder
        .add(this.camera.position, 'x')
        .name('Xcam')
        .min(-200)
        .max(100)
        .step(0.1)
      this.debugFolder
        .add(this.camera.position, 'y')
        .name('Ycam')
        .min(0)
        .max(70)
        .step(0.1)
      this.debugFolder
        .add(this.camera.position, 'z')
        .name('Zcam')
        .min(-100)
        .max(200)
        .step(0.1)
      this.debugFolder
        .add(this.camera.rotation, 'x')
        .name('X rot')
        .min(0)
        .max(7)
        .step(0.001)
      this.debugFolder
        .add(this.camera.rotation, 'y')
        .name('Y rot')
        .min(0)
        .max(7)
        .step(0.001)
      this.debugFolder
        .add(this.camera.rotation, 'z')
        .name('Z rot')
        .min(0)
        .max(7)
        .step(0.001)
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
