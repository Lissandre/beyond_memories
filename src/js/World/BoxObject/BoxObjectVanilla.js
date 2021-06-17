import {
  Object3D,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  Quaternion,
  Box3,
  Box3Helper,
} from 'three'

export default class BoxObjectVanilla {
  constructor(options) {
    this.child = options.child

    this.container = new Object3D()
    this.container.name = 'objectCollider'

    this.size = new Vector3()
    this.tempSize = new Vector3()
    this.quaternionstarW = new Quaternion()

    this.isCollected = false

    this.setCollider()
  }

  setCollider() {
    if (this.child.isMesh) {
      this.child.geometry.boundingBox.getSize(this.size)
      if (this.child.name === 'mod_starwars') {
        this.size = new Vector3(50, 50, 50)
      }
    } else {
      this.size = new Vector3(8, 8, 8)
      if (this.child.name === 'mod_skate') {
        this.size = new Vector3(20, 20, 20)
      }
    }
    this.geometry = new BoxGeometry(this.size.x, this.size.y, this.size.z)
    this.material = new MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
    this.cube = new Mesh(this.geometry, this.material)
    this.cube.quaternion.copy(this.child.quaternion)
    this.cube.position.copy(this.child.position)
    this.objectBB = new Box3().setFromObject(this.cube)
    const helper = new Box3Helper(this.objectBB, 0xff0000)
    this.container.add(this.cube, helper)
    // console.log(this.child);
  }
}
