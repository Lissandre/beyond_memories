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
    this.floor = this.assets.models.MAP.scene
    this.floor.traverse((child) => {
      if (child.name.includes('Cone')) {
        child.castShadow = true
        if (child.material.name.includes('LEAVES')) {
          child.material.transparent = true
        }
      }
      if (child.name.includes('ARBUSTE')) {
        child.castShadow = true
        if (child.material.name.includes('PLANT')) {
          child.material.transparent = true
        }
      }
      if (child.name.includes('Cube')) {
        if (child.material.name.includes('Leaf')) {
          child.castShadow = true
          child.material.transparent = true
        }
      }
      if (child.name.includes('SOL')) {
        child.receiveShadow = true
      }
    })
    // this.floor.scale.set(0.2, 0.2, 0.2)
    this.container.add(this.floor)
  }
}
