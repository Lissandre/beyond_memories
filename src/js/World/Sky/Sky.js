import { Object3D, Vector3, DirectionalLight } from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky'

export default class Skybox {

  constructor(options) {

    //Set options
    this.debug = options.debug
    this.time = options.time

    //Set options for effect controller
    this.turbidity = options.turbidity
    this.rayleigh = options.rayleigh
    this.mieCoefficient = options.mieCoefficient
    this.mieDirectionalG = options.mieDirectionalG
    this.azimuth = options.azimuth

    //Set options for sunLight
    this.lightColor = options.lightColor
    this.lightPower = options.lightPower

    // Set up
    this.container = new Object3D()
    this.sky = new Sky()
    this.sun = new Vector3()
    this.date = new Date()
    this.hours = this.date.getHours()
    this.minutes = this.date.getMinutes()

    this.effectController = {
      turbidity: this.turbidity,
      rayleigh: this.rayleigh,
      mieCoefficient: this.mieCoefficient,
      mieDirectionalG: this.mieDirectionalG,
      inclination: this.hours / 12 - 1 + this.minutes / 60 / 24,
      azimuth: this.azimuth,
    }

    this.createSkyBox()
    this.createSunLight()
    if (this.debug) {
      this.setDebug()
    }

  }

  createSkyBox() {
    this.uniforms = this.sky.material.uniforms
    this.uniforms['turbidity'].value = this.effectController.turbidity
    this.uniforms['rayleigh'].value = this.effectController.rayleigh
    this.uniforms['mieCoefficient'].value = this.effectController.mieCoefficient
    this.uniforms['mieDirectionalG'].value = this.effectController.mieDirectionalG
    this.setOrientation()

    this.time.on('tick', () => {
      this.date = new Date()
      this.hours = this.date.getHours()
      this.minutes = this.date.getMinutes()
      this.effectController.inclination = this.hours / 12 - 1 + this.minutes / 60 / 24
    })

    this.sky.scale.setScalar(450000)
    this.container.add(this.sky)
  }

  createSunLight() {
    this.light = new DirectionalLight(this.lightColor, this.lightPower)
    this.light.castShadow = true
    this.light.shadow.mapSize.width = 1920
    this.light.shadow.mapSize.height = 1920
    this.light.position.copy(this.sun)
    this.container.add(this.light)
  }

  setOrientation() {
    this.theta = Math.PI * (this.effectController.inclination - 0.5)
    this.phi = 2 * Math.PI * (this.effectController.azimuth - 0.5)
    this.sun.x = Math.cos(this.phi)
    this.sun.y = Math.sin(this.phi) * Math.sin(this.theta)
    this.sun.z = Math.sin(this.phi) * Math.cos(this.theta)
    this.uniforms['sunPosition'].value.copy(this.sun)
  }

  setDebug() {
    this.debugFolder = this.debug.addFolder('Sky')
    this.debugFolder
      .add(this.effectController, 'turbidity', 0.0, 20.0, 0.1)
      .onChange(() => {
        this.uniforms['turbidity'].value = this.effectController.turbidity
      })
    this.debugFolder
      .add(this.effectController, 'rayleigh', 0.0, 4, 0.001)
      .onChange(() => {
        this.uniforms['rayleigh'].value = this.effectController.rayleigh
      })
    this.debugFolder
      .add(this.effectController, 'mieCoefficient', 0.0, 0.1, 0.001)
      .onChange(() => {
        this.uniforms[
          'mieCoefficient'
        ].value = this.effectController.mieCoefficient
      })
    this.debugFolder
      .add(this.effectController, 'mieDirectionalG', 0.0, 1, 0.001)
      .onChange(() => {
        this.uniforms[
          'mieDirectionalG'
        ].value = this.effectController.mieDirectionalG
      })
    this.debugFolder
      .add(this.effectController, 'azimuth', 0, 1, 0.0001)
      .onChange(() => {
        this.setOrientation()
        this.light.position.copy(this.sun)

      })
    this.debugFolder.add(this, 'hours', 0, 23, 1).onChange(() => {
      this.effectController.inclination =
        this.hours / 12 - 1 + this.minutes / 60 / 24
      this.setOrientation()
      this.light.position.copy(this.sun)
    })
    this.debugFolder.add(this, 'minutes', 0, 59, 1).onChange(() => {
      this.effectController.inclination =
        this.hours / 12 - 1 + this.minutes / 60 / 24
      this.setOrientation()
      this.light.position.copy(this.sun)
    })
  }

}