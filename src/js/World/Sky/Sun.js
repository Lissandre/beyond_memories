import {
  Object3D,
  DirectionalLight,
  DirectionalLightHelper,
  Vector3,
} from 'three'

export default class Sun {
  constructor(options) {
    //Set options
    this.debug = options.debug
    this.time = options.time

    this.color = options.color
    this.intensity = options.intensity

    // Set up
    this.container = new Object3D()

    this.createSun()
  }

  createSun() {
    this.light = new DirectionalLight(this.color, this.intensity)
    this.light.castShadow = true
    this.light.shadow.mapSize.width = 4096; // default
    this.light.shadow.mapSize.height = 4096; // default
    this.light.shadow.camera.top = 150
    this.light.shadow.camera.bottom = -150
    this.light.shadow.camera.left = -150
    this.light.shadow.camera.right = 150
    this.target = new Vector3(0, 0, 0)
    // this.light.target = this.target

    this.helper = new DirectionalLightHelper(this.light, 10)

    this.container.add(this.light)
  }
}
