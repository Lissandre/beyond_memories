import { BoxBufferGeometry, Mesh, MeshLambertMaterial, Object3D, Vector3 } from "three"

export default class Perso {
  constructor(options) {
    // Set options
    this.time = options.time
    this.camera = options.camera

    // Set up
    this.container = new Object3D()
    this.moveForward = false
    this.moveBackward = false
    this.moveLeft = false
    this.moveRight = false

    this.setPerso()
    this.setListeners()
    this.setMovements()
  }
  setPerso() {
    this.perso = new Mesh(
      new BoxBufferGeometry(0.6, 1.5, 0.3),
      new MeshLambertMaterial({color: 0xff0000})
    )
    this.perso.translateY(0.75)
    this.container.add(this.perso)
  }
  setListeners() {
    document.addEventListener(
      'keydown',
      (event) => {
        switch (event.code) {
          case 'ArrowUp': // up
          case 'KeyW': // w
            this.moveForward = true
            break
          case 'ArrowLeft': // left
          case 'KeyA': // a
            this.moveLeft = true
            break
          case 'ArrowDown': // down
          case 'KeyS': // s
            this.moveBackward = true
            break
          case 'ArrowRight': // right
          case 'KeyD': // d
            this.moveRight = true
            break
          case 'KeyC':
            this.shift = true
            break
          case 'ShiftLeft':
            this.run = true
            break
          // case 'Space': // space
          //   if ( this.canJump === true ) this.velocity.y += 2
          //   this.canJump = false
          //   break
        }
      },
      false
    )
    document.addEventListener(
      'keyup',
      (event) => {
        switch (event.code) {
          case 'ArrowUp': // up
          case 'KeyW': // w
            this.moveForward = false
            break
          case 'ArrowLeft': // left
          case 'KeyA': // a
            this.moveLeft = false
            break
          case 'ArrowDown': // down
          case 'KeyS': // s
            this.moveBackward = false
            break
          case 'ArrowRight': // right
          case 'KeyD': // d
            this.moveRight = false
            break
          case 'KeyC':
            this.shift = false
            break
          case 'ShiftLeft':
            this.run = false
            break
        }
      },
      false
    )
  }
  setMovements() {
    let vec = new Vector3()
    this.time.on('tick', () => {
      if (this.moveForward) {
        vec.setFromMatrixColumn( this.perso.matrix, 0 )
        vec.crossVectors( this.perso.up, vec )
        this.perso.position.addScaledVector( vec, 0.1 )
        this.camera.cameraUpdate(this.perso.position)
      }
      if (this.moveBackward) {
        vec.setFromMatrixColumn( this.perso.matrix, 0 )
        vec.crossVectors( this.perso.up, vec )
        this.perso.position.addScaledVector( vec, -0.1 )
        this.camera.cameraUpdate(this.perso.position)
      }
      if (this.moveLeft) {
        vec.setFromMatrixColumn( this.perso.matrix, 0 )
        this.perso.position.addScaledVector( vec, -0.06 )
        this.camera.cameraUpdate(this.perso.position)
      }
      if (this.moveRight) {
        vec.setFromMatrixColumn( this.perso.matrix, 0 )
        this.perso.position.addScaledVector( vec, 0.06 )
        this.camera.cameraUpdate(this.perso.position)
      }
    })
  }
}