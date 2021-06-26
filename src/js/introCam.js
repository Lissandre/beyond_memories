import { Object3D, PerspectiveCamera, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class IntroCam {
  constructor(options) {
    // Set Options
    this.time = options.time
    this.sizes = options.sizes
    this.renderer = options.renderer
    this.debug = options.debug
    this.homeDiv = options.homeDiv

    // Set up
    this.container = new Object3D()
    // this.container.translateY(0.75)
    this.container.name = 'Intro cam'

    this.stateCam = 1

    this.firstTravel = new Vector3(62, 25.8,7.2)
    this.firstRota = new Vector3(5.5556, 1.239, 0.628)

    this.secTravel =  new Vector3(-89.3, 12.8, 108.5)
    this.secRota =  new Vector3(0, 5.923, 0)

    this.thirdTravel =  new Vector3(-61.4, 6.7, -88.8)
    this.thirdRota = new Vector3(0.261, 2.99, 0)

    this.setCamera()
    this.setPosition()
    this.animateCam()
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
      this.camera.position.x = 62
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

  animateCam() {
    this.time.on('tick', ()=> {
      if(this.stateCam === 1) {
        this.targetPos1 =  new Vector3(61, 34.8, 23)
        this.camera.position.lerp(this.targetPos1, 0.00025)
        console.log(this.camera.position);
        if(this.camera.position.z > 17) {
          this.homeDiv.style.backgroundColor = "#000"
        }
        if(this.camera.position.z > 17.22) {
          this.stateCam = 2
          this.homeDiv.style.backgroundColor = "transparent"
          this.camera.position.set(this.secTravel.x, this.secTravel.y, this.secTravel.z)
          this.camera.rotation.set(this.secRota.x, this.secRota.y, this.secRota.z)
        }
      }else if(this.stateCam === 2) {
        this.targetPos2 =  new Vector3(-70, 12.8, 108.5)
        this.camera.position.lerp(this.targetPos2, 0.00025)
        console.log(this.camera.position);
        if(this.camera.position.x > -79.5) {
          this.homeDiv.style.backgroundColor = "#000"
        }
        if(this.camera.position.x > -79.3) {
          this.stateCam = 1
          this.homeDiv.style.backgroundColor = "transparent"
          this.camera.position.set(this.firstTravel.x, this.firstTravel.y, this.firstTravel.z)
          this.camera.rotation.set(this.firstRota.x, this.firstRota.y, this.firstRota.z)
        }
      }
    })
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
