import {
  Box3,
  Object3D,
  Mesh,
  BoxBufferGeometry,
  MeshLambertMaterial,
  Vector3,
  RepeatWrapping
} from 'three'
import { Body, Box, Vec3 } from 'cannon-es'

export default class Floor {
  constructor(options) {
    // Set options
    this.physic = options.physic
    this.assets = options.assets

    // Set up
    this.container = new Object3D()

    this.setFloor()
    this.setPhysic()
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
    this.floor.position.y = -0.05
    this.floor.receiveShadow = true
    this.container.add(this.floor)
  }
  setPhysic() {
    this.size = new Vector3()
    this.center = new Vector3()
    this.calcBox = new Box3().setFromObject(this.container)

    this.calcBox.getSize(this.size)
    this.size.x *= 0.5
    this.size.y *= 0.5
    this.size.z *= 0.5
    this.calcBox.getCenter(this.center)

    this.box = new Box(new Vec3().copy(this.size))
    this.container.body = new Body({
      mass: 0,
      position: this.center,
      material: this.physic.groundMaterial,
    })

    this.container.body.addShape(this.box)
    this.physic.world.addBody(this.container.body)
  }
}
