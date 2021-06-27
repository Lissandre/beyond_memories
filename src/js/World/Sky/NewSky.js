import { Object3D, Vector3, MathUtils } from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import Sun from './Sun'
import SpotSun from './SpotSun'

export default class Skybox {
  constructor(options) {
    //Set options
    this.debug = options.debug
    this.time = options.time
    this.renderer = options.renderer
    this.composer = options.composer

    this.sun
    this.sky

    this.effectController = {
      turbidity: 0.03,
      rayleigh: 0.2,
      mieCoefficient: 0.037,
      mieDirectionalG: 0.823,
      elevation: 35.4,
      azimuth: -135,
      exposure: this.composer.toneMappingExposure,
    }

    this.container = new Object3D()

    this.createSkyBox()
    this.setSun()
    this.setSpotSun()
    if (this.debug) {
      this.setDebug()
    }
  }

  createSkyBox() {
    this.sky = new Sky()
    this.sky.scale.setScalar(450000)
    this.sun = new Vector3()

    this.container.add(this.sky)

    this.uniforms = this.sky.material.uniforms
    this.uniforms['turbidity'].value = this.effectController.turbidity
    this.uniforms['rayleigh'].value = this.effectController.rayleigh
    this.uniforms['mieCoefficient'].value = this.effectController.mieCoefficient
    this.uniforms[
      'mieDirectionalG'
    ].value = this.effectController.mieDirectionalG

    this.phi = MathUtils.degToRad(90 - this.effectController.elevation)
    this.theta = MathUtils.degToRad(this.effectController.azimuth)

    this.sun.setFromSphericalCoords(1, this.phi, this.theta)

    this.uniforms['sunPosition'].value.copy(this.sun)

    this.composer.toneMappingExposure = this.effectController.exposure
  }

  setSun() {
    this.sunObj = new Sun({
      debug: this.debug,
      time: this.time,
      color: 0xffe49e,
      intensity: 0.7,
    })
    this.sunObj.container.position.set(-96.6, 70, -70)
    this.container.add(this.sunObj.container)
  }

  setSpotSun() {
    this.sunSpot = new SpotSun({
      position: {
        x: this.sunObj.container.position.x,
        y: this.sunObj.container.position.y,
        z: this.sunObj.container.position.z - 100,
      },
      intensity: 2.6,
      distanceSpot: 414.3,
      angleSpot: 20,
      debug: this.debug,
    })
    this.container.add(this.sunSpot.container)
  }

  setDebug() {
    this.debugFolder = this.debug.addFolder('Sky')
    this.debugFolder
      .add(this.uniforms['rayleigh'], 'value')
      .name('Rayleigh')
      .min(0.1)
      .max(1.0)
      .step(0.01)
    this.debugFolder
      .add(this.uniforms['turbidity'], 'value')
      .name('Turbidity')
      .min(0.0)
      .max(1.0)
      .step(0.01)
    this.debugFolder
      .add(this.uniforms['mieCoefficient'], 'value')
      .name('mieCoefficient')
      .min(0.0)
      .max(1.0)
      .step(0.001)
    this.debugFolder
      .add(this.uniforms['mieDirectionalG'], 'value')
      .name('mieDirectionalG')
      .min(0.0)
      .max(1.0)
      .step(0.001)
    this.debugFolder
      .add(this.sunObj.container.position, 'x')
      .name('X of sun light')
      .min(-200)
      .max(200)
      .step(0.1)
    this.debugFolder
      .add(this.sunObj.container.position, 'y')
      .name('Y of sun light')
      .min(0)
      .max(200)
      .step(0.1)
    this.debugFolder
      .add(this.sunObj.container.position, 'z')
      .name('Z of sun light')
      .min(-200)
      .max(200)
      .step(0.1)
  }
}
