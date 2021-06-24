import {
  Object3D,
  Color,
  SphereBufferGeometry,
  ShaderMaterial,
  BackSide,
  Mesh,
} from 'three'
import SkyFrag from '@shaders/Sky/SkyFrag.frag'
import SkyVert from '@shaders/Sky/SkyVert.vert'
import Sun from './Sun'
import SpotSun from './SpotSun'

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
    this.setSpotSun()
  }

  createSkyBox() {
    this.uniforms = {
      topColor: { value: new Color(this.sphereTopColor) },
      bottomColor: { value: new Color(this.sphereBottomColor) },
      offset: { value: this.offset },
      exponent: { value: this.exponent },
    }

    this.skyGeo = new SphereBufferGeometry(300, 32, 45)
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
    this.sunObj = new Sun({
      debug: this.debug,
      time: this.time,
      color: 0xFFE49E,
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
            z: this.sunObj.container.position.z - 100
        },
        intensity: 2.6,
        distanceSpot: 414.3,
        angleSpot: 20,
        debug: this.debug
    })
    this.container.add(this.sunSpot.container)
}

}
