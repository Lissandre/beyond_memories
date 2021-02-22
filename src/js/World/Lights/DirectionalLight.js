import { Object3D, DirectionalLight, Color } from 'three'

export default class DirectionalLight {
  constructor(options) {

    // Set up
    this.container = new Object3D()
    this.container.name = 'Directional Light'
    this.params = { color: 0x232323 }

    this.createDirectionalLight()
  }
  createDirectionalLight() {
    this.light = new DirectionalLight(this.params.color, 1)
    this.container.add(this.light)
  }
}
