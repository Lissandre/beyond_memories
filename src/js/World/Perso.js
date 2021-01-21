import { BoxBufferGeometry, Mesh, MeshLambertMaterial, Object3D, Vector3, Quaternion, Euler } from "three"
import Mouse from '@tools/Mouse'
import { TweenMax } from 'gsap'

export default class Perso {
  constructor(options) {
    // Set options
    this.time = options.time
    this.camera = options.camera

    // Set up
    this.container = new Object3D()
    this.mouse = new Mouse()
    this.moveForward = false
    this.moveBackward = false
    this.moveLeft = false
    this.moveRight = false
    this.rotation = 0
    this.speed = 0
    this.deceleration = 0.12

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
        this.lerpOrientation()
      }
      if (this.moveBackward) {
        vec.setFromMatrixColumn( this.perso.matrix, 0 )
        vec.crossVectors( this.perso.up, vec )
        this.perso.position.addScaledVector( vec, -0.1 )
        this.camera.cameraUpdate(this.perso.position)
        this.lerpOrientation()
      }
      if (this.moveLeft) {
        vec.setFromMatrixColumn( this.perso.matrix, 0 )
        this.perso.position.addScaledVector( vec, -0.06 )
        this.camera.cameraUpdate(this.perso.position)
        this.lerpOrientation()
      }
      if (this.moveRight) {
        vec.setFromMatrixColumn( this.perso.matrix, 0 )
        this.perso.position.addScaledVector( vec, 0.06 )
        this.camera.cameraUpdate(this.perso.position)
        this.lerpOrientation()
      }
      if (this.mouse.grab === true) {
        this.speed = 0
        this.speedY = 0
        this.speed = -this.mouse.delta.x * 0.1
        this.speedY = -this.mouse.delta.y * 0.01
      } else if (this.mouse.grab === false && (Math.abs(this.speed) > 0 || Math.abs(this.speedY) > 0)) {
        Math.sign(this.speed) * this.speed - this.deceleration > 0
          ? (this.speed -= Math.sign(this.speed) * this.deceleration)
          : (this.speed = 0)
        Math.sign(this.speedY) * this.speedY - this.deceleration > 0
          ? (this.speedY -= Math.sign(this.speedY) * this.deceleration)
          : (this.speedY = 0)
        console.log(this.speedY);
      }
      if(this.speedY) {
        if (this.camera.camera.position.y + this.speedY > 3) {
          this.camera.camera.position.y = 3
          this.speedY = 0
        } else if (this.camera.camera.position.y + this.speedY < 0.5) {
          this.camera.camera.position.y = 0.5
          this.speedY = 0
        } else {
          this.camera.camera.position.y += this.speedY
        }
      }
      this.camera.camera.lookAt(this.perso.position)
      this.deltaRotationQuaternion = new Quaternion().setFromEuler(
        new Euler(0, this.toRadians(this.speed), 0, 'XYZ')
      )
      this.camera.container.quaternion.multiplyQuaternions(
        this.deltaRotationQuaternion,
        this.camera.container.quaternion
      )
    })
  }
  lerpOrientation() {
    if(this.camera.container.quaternion != this.perso.quaternion) {
      TweenMax.to(this.perso.quaternion, {
        duration: 0.42,
        x: this.camera.container.quaternion.x,
        y: this.camera.container.quaternion.y,
        z: this.camera.container.quaternion.z,
        w: this.camera.container.quaternion.w
      })
    }
  }
  toRadians(angle) {
    return angle * (Math.PI / 180)
  }
}