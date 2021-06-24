import { Object3D, HemisphereLight, Color } from 'three'

export default class HemisphereLightSource {
  constructor(options) {
    // Set options
    this.debug = options.debug

    // Set up
    this.container = new Object3D()
    this.container.name = 'Hemisphere Light'
    this.params = {
      skycolor: 0x989898,
      groundcolor: 0x43ac,
      intensity: 1,
    }

    this.createHemisphereLight()

    if (this.debug) {
      this.setDebug()
    }
  }
  createHemisphereLight() {
    this.light = new HemisphereLight(
      this.params.skycolor,
      this.params.groundcolor,
      this.params.intensity
    )
    this.container.add(this.light)
  }
  setDebug() {
    // Color debug
    this.debugFolder = this.debug.addFolder('Hemisphere Light')
    this.debugFolder
      .addColor(this.params, 'skycolor')
      .name('Sky Color')
      .onChange(() => {
        this.light.color = new Color(this.params.skycolor)
      })
    this.debugFolder
      .addColor(this.params, 'groundcolor')
      .name('Ground Color')
      .onChange(() => {
        this.light.groundColor = new Color(this.params.groundcolor)
      })
    this.debugFolder
      .add(this.light, 'intensity')
      .name('Intensity')
      .min(0)
      .max(10)
      .step(0.1)
  }
}
