import { Object3D, HemisphereLight, Color } from 'three'


export default class HemisphereLightSource {
  constructor(options) {
    // Set options
    this.debug = options.debug

    // Set up
    this.container = new Object3D()
    this.container.name = 'Hemisphere Light'
    this.params = {
      skycolor: 0xffffff,
      groundcolor: 0xffffff,
      positionX: 0,
      positionY: 2,
      positionZ: 5,
    }

    this.createHemisphereLight()

    if (this.debug) {
      this.setDebug()
    }
  }
  createHemisphereLight() {
    this.light = new HemisphereLight(this.params.skycolor, this.params.groundcolor)
    this.light.position.set(
      this.params.positionX,
      this.params.positionY,
      this.params.positionZ
    )
    this.container.add(this.light)
    console.log(this.light);
  }
  setDebug() {
    // Color debug
    this.debugFolder = this.debug.addFolder('Hemisphere Light')
    this.debugFolder.open()
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
    //Position debug
    this.debugFolder
      .add(this.light.position, 'x')
      .step(0.1)
      .min(-5)
      .max(5)
      .name('Position X')
    this.debugFolder
      .add(this.light.position, 'y')
      .step(0.1)
      .min(-5)
      .max(5)
      .name('Position Y')
    this.debugFolder
      .add(this.light.position, 'z')
      .step(0.1)
      .min(-5)
      .max(5)
      .name('Position Z')
  }
}
