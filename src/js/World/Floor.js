import {
  Object3D,
  Mesh,
  BoxBufferGeometry,
  MeshLambertMaterial,
  RepeatWrapping
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
    this.assets.textures.floor.repeat.set(10, 10);
    this.assets.textures.floor.wrapS = RepeatWrapping;
    this.assets.textures.floor.wrapT = RepeatWrapping;

    this.floor = new Mesh(
      new BoxBufferGeometry(200, 200, 0.1, 1, 1, 1),
      new MeshLambertMaterial({ map: this.assets.textures.floor })
    )
    this.floor.rotateX(-Math.PI / 2)
    this.floor.position.y = 0
    this.floor.receiveShadow = true
    this.container.add(this.floor)
  }
}
