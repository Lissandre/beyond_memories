import {
  Object3D,
} from 'three'

export default class Floor {
  constructor(options) {
    // Set options
    this.assets = options.assets

    // Set up
    this.container = new Object3D()

    this.setFloor()
  }
  setFloor() {
    this.floor = this.assets.models.LOWPOLYWORLD.scene
    // this.floor.scale.set(0.2, 0.2, 0.2)
    this.container.add(this.floor)
  }
}
