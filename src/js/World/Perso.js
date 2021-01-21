import { BoxBufferGeometry, Mesh, MeshLambertMaterial, Object3D } from "three"

export default class Perso {
  constructor() {
    // Set options
    // Set up
    this.container = new Object3D()

    this.setPerso()
  }
  setPerso() {
    this.perso = new Mesh(
      new BoxBufferGeometry(0.6, 1.5, 0.3),
      new MeshLambertMaterial({color: 0xff0000})
    )
    this.perso.position.set(0, 0.75, 0)
    this.container.add(this.perso)
  }
}