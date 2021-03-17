import {
  Object3D,
  Color,
  SphereBufferGeometry,
  ShaderMaterial,
  BackSide,
  Mesh,
} from 'three'
import SkyFrag from '@shaders/SkyFrag.frag'
import SkyVert from '@shaders/SkyVert.vert'
import Sun from './Sun'

export default class Skybox {
  constructor(options) {
    //Set options
    this.debug = options.debug
    this.time = options.time

    //Set options for sphere color
    this.sphereTopColor = options.sphereTopColor
    this.sphereBottomColor = options.sphereBottomColor
    this.offset = options.offset
    this.exponent = options.exponent

    //Set options for Sun
    this.color = options.color
    this.intensity = options.color

    // Set up
    this.container = new Object3D()

    this.createSkyBox()
  }

  createSkyBox() {
    this.uniforms = {
      topColor: { value: new Color(this.sphereTopColor) },
      bottomColor: { value: new Color(this.sphereBottomColor) },
      offset: { value: this.offset },
      exponent: { value: this.exponent },
    }

    this.skyGeo = new SphereBufferGeometry(250, 32, 45)
    this.skyMat = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: SkyVert,
      fragmentShader: SkyFrag,
      side: BackSide,
    })
    this.sky = new Mesh(this.skyGeo, this.skyMat)

    
    this.time.on('tick', () => {
      this.date = new Date()
      this.hours = this.date.getHours()
      this.minutes = this.date.getMinutes()
      // this.effectController.inclination = this.hours / 12 - 1 + this.minutes / 60 / 24
    })
    
    this.container.add(this.sky)

    this.setSun()
  }

  setSun() {
    this.sun = new Sun({
      debug: this.debug,
      time: this.time,
      color: 0xf2ebd0,
      intensity: 0.3
    })
    this.sun.container.position.set(150, 100,-150)
    this.container.add(this.sun.container)
  }
}
