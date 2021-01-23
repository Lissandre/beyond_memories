import {
  BoxBufferGeometry,
  Box3,
  Mesh,
  MeshLambertMaterial,
  Object3D,
  Vector3,
  Quaternion,
  Euler,
} from 'three'
import { Body, Box, Vec3 } from 'cannon-es'
import Mouse from '@tools/Mouse'
import { TweenMax } from 'gsap'

export default class Perso {
  constructor(options) {
    // Set options
    this.time = options.time
    this.camera = options.camera
    this.physic = options.physic

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
    this.setPhysic()
    this.setListeners()
    this.setMovements()
  }
  setPerso() {
    this.perso = new Mesh(
      new BoxBufferGeometry(0.6, 1.5, 0.3),
      new MeshLambertMaterial({ color: 0xff0000 })
    )
    this.perso.position.set(0, 0.75, 0)
    this.perso.castShadow = true
    this.container.add(this.perso)
  }
  setListeners() {
    // this.canJump = false
    // this.contactNormal = new Vec3() // Normal in the contact, pointing *out* of whatever the player touched
    // this.upAxis = new Vec3(0,1,0)
    // this.body.addEventListener("collide",function(e){
    //   this.contact = e.contact
    //   // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
    //   // We do not yet know which one is which! Let's check.
    //   if(this.contact.bi.id == this.body.id)  // bi is the player body, flip the contact normal
    //     this.contact.ni.negate(this.contactNormal)
    //   else
    //     this.contactNormal.copy(this.contact.ni) // bi is something else. Keep the normal as it is
    //     // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
    //   if(this.contactNormal.dot(this.upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
    //     this.canJump = true
    // })
    // this.velocity = this.body.velocity
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
          case 'Space': // space
            // if ( this.canJump === true ){
              // this.body.velocity.y=-200
              this.body.applyImpulse(new Vec3(0,25,0))
            // }
            this.canJump = false
            break
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
        vec.setFromMatrixColumn(this.perso.matrix, 0)
        vec.crossVectors(this.perso.up, vec)
        let oldp = new Vector3().copy(this.body.position)
        oldp.addScaledVector(vec, 0.1)
        this.body.position.copy(oldp)
        this.setPosition()
        this.camera.cameraUpdate(this.perso.position)
        this.lerpOrientation()
      }
      if (this.moveBackward) {
        vec.setFromMatrixColumn(this.perso.matrix, 0)
        vec.crossVectors(this.perso.up, vec)
        let oldp = new Vector3().copy(this.body.position)
        oldp.addScaledVector(vec, -0.1)
        this.body.position.copy(oldp)
        this.setPosition()
        this.camera.cameraUpdate(this.perso.position)
        this.lerpOrientation()
      }
      if (this.moveLeft) {
        vec.setFromMatrixColumn(this.perso.matrix, 0)
        let oldp = new Vector3().copy(this.body.position)
        oldp.addScaledVector(vec, -0.06)
        this.body.position.copy(oldp)
        this.setPosition()
        this.camera.cameraUpdate(this.perso.position)
        this.lerpOrientation()
      }
      if (this.moveRight) {
        vec.setFromMatrixColumn(this.perso.matrix, 0)
        let oldp = new Vector3().copy(this.body.position)
        oldp.addScaledVector(vec, 0.06)
        this.body.position.copy(oldp)
        this.setPosition()
        this.camera.cameraUpdate(this.perso.position)
        this.lerpOrientation()
      }
      if (this.mouse.grab === true) {
        this.speed = 0
        this.speedY = 0
        this.speed = -this.mouse.delta.x * 0.1
        this.speedY = this.mouse.delta.y * 0.01
      } else if (
        this.mouse.grab === false &&
        (Math.abs(this.speed) > 0 || Math.abs(this.speedY) > 0)
      ) {
        Math.sign(this.speed) * this.speed - this.deceleration > 0
          ? (this.speed -= Math.sign(this.speed) * this.deceleration)
          : (this.speed = 0)
        Math.sign(this.speedY) * this.speedY - this.deceleration > 0
          ? (this.speedY -= Math.sign(this.speedY) * this.deceleration)
          : (this.speedY = 0)
      }
      if (this.speedY) {
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
      this.camera.camera.lookAt(this.camera.container.position)
      this.deltaRotationQuaternion = new Quaternion().setFromEuler(
        new Euler(0, this.toRadians(this.speed), 0, 'XYZ')
      )
      this.camera.container.quaternion.multiplyQuaternions(
        this.deltaRotationQuaternion,
        this.camera.container.quaternion
      )
      if (this.perso.position != this.body.position) {
        this.setPosition()
      }
    })
  }
  lerpOrientation() {
    if (this.camera.container.quaternion != this.body.quaternion) {
      TweenMax.to(this.body.quaternion, {
        duration: 0.42,
        x: this.camera.container.quaternion.x,
        y: this.camera.container.quaternion.y,
        z: this.camera.container.quaternion.z,
        w: this.camera.container.quaternion.w,
      })
      TweenMax.to(this.perso.quaternion, {
        duration: 0.42,
        x: this.camera.container.quaternion.x,
        y: this.camera.container.quaternion.y,
        z: this.camera.container.quaternion.z,
        w: this.camera.container.quaternion.w,
      })
    }
  }
  toRadians(angle) {
    return angle * (Math.PI / 180)
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
    this.body = new Body({
      mass: 5,
      position: this.center,
      allowSleep: false,
    })

    this.body.addShape(this.box)
    this.physic.world.addBody(this.body)
  }
  setPosition() {
    this.perso.position.set(
      this.body.position.x - this.center.x,
      this.body.position.y,
      this.body.position.z - this.center.z
    )
  }
}
