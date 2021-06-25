import {
  Object3D,
  DirectionalLight,
  DirectionalLightHelper,
  Vector3,
  Color
} from 'three'

export default class Sun {
  constructor(options) {
    //Set options
    this.debug = options.debug
    this.time = options.time

    this.color = options.color
    this.intensity = options.intensity

    this.params = {
      color: 0xffc942,
      intensity: 2.64
    }

    // Set up
    this.container = new Object3D()
    this.container.name = "sun"

    this.createSun()
    if(this.debug) {
      this.setDebug()
    }
  }

  createSun() {
    this.light = new DirectionalLight(this.color, this.params.intensity)
    this.light.castShadow = true
    this.light.shadow.mapSize.width = 4096; // default
    this.light.shadow.mapSize.height = 4096; // default
    this.light.shadow.bias = 0.00035;
    this.light.shadow.camera.top = 120
    this.light.shadow.camera.bottom = -120
    this.light.shadow.camera.left = -120
    this.light.shadow.camera.right = 120
    this.target = new Vector3(0, 0, 0)

    this.container.add(this.light)
  }

  setDebug() {
    this.helper = new DirectionalLightHelper(this.light, 10)

    this.debugFolder = this.debug.addFolder('Sun')
    this.debugFolder
      .addColor(this.params, 'color')
      .name('Color')
      .onChange(() => {
        this.light.color = new Color(this.params.color)
      })
    this.debugFolder
      .add(this.light, 'intensity')
      .name('intensity')
      .min(0.0)
      .max(10.0)
      .step(0.01)
  }
}
