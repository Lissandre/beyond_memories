import {
  Object3D,
  MeshLambertMaterial,
  FrontSide
} from 'three'

export default class Floor {
  constructor(options) {
    // Set options
    this.assets = options.assets

    // Set up
    this.container = new Object3D()
    this.container.name = "map"

    this.setFloor()
  }
  setFloor() {
    // this.assets.textures.water.repeat.set(10, 10);
    // this.assets.textures.water.wrapS = RepeatWrapping;
    // this.assets.textures.water.wrapT = RepeatWrapping;

    this.texture = new MeshLambertMaterial({ map: this.assets.textures.water })

    this.floor = this.assets.models.MAP_NOT_CONVERTED3.scene
    this.floor.traverse((child) => {
      if (child.name.includes('Cone') || child.name.includes('Cylinder') || child.name.includes('Cube')) {
        child.castShadow = true
        if (child.material.name.includes('LEAVES') || child.material.name.includes('Leaf') || child.material.name.includes('rock') || child.material.name.includes('WOOD')) {
          child.material.transparent = true
        }
      }
      if (child.name.includes('ARBUSTE')) {
        child.castShadow = true
        if (child.material.name.includes('PLANT')) {
          child.material.transparent = true
        }
      }
      if (child.name.includes('HOUSE') || child.name.includes('ROCK')) {
        child.castShadow = true
      }
      if (child.name.includes('SOL')) {
        child.receiveShadow = true
      }
      if (child.name.includes('ARMOIR')) {
        child.castShadow = true
      }
      if (child.name.includes('CLOUD')) {
        child.castShadow = true
      }
      if (child.name.includes('ROCHER_MASSIF')) {
        child.castShadow = true
        child.receiveShadow = true
        child.material.side = FrontSide
      }
      if(child.name.includes('EAU')) {
        child.material = this.texture
      }
    })
    // this.floor.scale.set(0.2, 0.2, 0.2)
    this.container.add(this.floor)
  }
}
