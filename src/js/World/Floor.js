import { Object3D, Mesh, PlaneBufferGeometry, MeshLambertMaterial } from 'three'

export default class Floor {
  constructor() {
    // Set options
    // Set up
    this.container = new Object3D()
    this.setFloor()
  }
  setFloor() {
    this.floor = new Mesh(
      new PlaneBufferGeometry(200, 200, 1, 1),
      new MeshLambertMaterial({color: 0x959595})
    )
    this.floor.rotateX(-Math.PI/2)
    this.container.add(this.floor)
  }
}