import { Object3D, Mesh, PlaneBufferGeometry, MeshLambertMaterial } from 'three'
import { Body, Plane, Vec3 } from 'cannon-es'

export default class Floor {
  constructor(options) {
    // Set options
    this.physic = options.physic

    // Set up
    this.container = new Object3D()

    this.setFloor()
    this.setPhysic()
  }
  setFloor() {
    this.floor = new Mesh(
      new PlaneBufferGeometry(200, 200, 200, 200),
      new MeshLambertMaterial({ color: 0x959595, wireframe: true })
    )
    this.floor.rotateX(-Math.PI / 2)
    this.container.add(this.floor)
  }
  setPhysic() {
    this.ground = new Body({
      mass: 0,
      shape: new Plane(),
      position: new Vec3(0, 0, 0),
      material: this.physic.groundMaterial,
    })
    this.ground.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2)

    this.physic.world.addBody(this.ground)
  }
}
