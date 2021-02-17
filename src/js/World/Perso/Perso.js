import {
  // BoxBufferGeometry,
  Box3,
  // Mesh,
  // MeshLambertMaterial,
  Object3D,
  Vector3,
  Quaternion,
  Euler,
} from 'three'
import { threeToCannon } from 'three-to-cannon'
import { Body, Vec3 } from 'cannon-es'
import Mouse from '@tools/Mouse'
// import { TweenMax } from 'gsap'

export default class Perso {
  constructor(options) {
    // Set options
    this.time = options.time
    this.assets = options.assets
    this.camera = options.camera
    this.physic = options.physic
    this.debug = options.debug

    // Set up
    this.container = new Object3D()
    this.mouse = new Mouse()
    this.moveForward = false
    this.moveBackward = false
    this.moveLeft = false
    this.moveRight = false
    this.rotation = 0
    this.speed = 0
    this.canJump = false
    this.params = {
      deceleration: 0.12,
      sideSpeed: 0.06,
      frontSpeed: 0.1,
      jumpForce: 180,
      cameraSpeedX: 0.1,
      cameraSpeedY: 0.01,
      cameraMaxY: 3,
      cameraMinY: 0.5,
      persoMass: 35,
      lerpSpeed: 0.005,
    }

    this.setPerso()
    this.setPhysic()
    this.setListeners()
    this.setMovements()
    this.setDebug()
  }
  setPerso() {
    this.perso = this.assets.models.RobotExpressive.scene
    this.perso.scale.set(0.2, 0.2, 0.2)
    this.perso.children[0].rotation.set(0, Math.PI, 0)
    this.perso.castShadow = true
    this.container.add(this.perso)
    console.log(this.assets.models.RobotExpressive);
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
          case 'Space': // space
            if (this.canJump) {
              // this.body.allowSleep = false
              this.body.applyImpulse(new Vec3(0, this.params.jumpForce, 0))
            }
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
        oldp.addScaledVector(vec, this.params.frontSpeed)
        this.body.position.copy(oldp)
        this.setPosition()
        this.camera.cameraUpdate(this.perso.position)
        this.lerpOrientation()
      }
      if (this.moveBackward) {
        vec.setFromMatrixColumn(this.perso.matrix, 0)
        vec.crossVectors(this.perso.up, vec)
        let oldp = new Vector3().copy(this.body.position)
        oldp.addScaledVector(vec, -this.params.frontSpeed)
        this.body.position.copy(oldp)
        this.setPosition()
        this.camera.cameraUpdate(this.perso.position)
        this.lerpOrientation()
      }
      if (this.moveLeft) {
        vec.setFromMatrixColumn(this.perso.matrix, 0)
        let oldp = new Vector3().copy(this.body.position)
        oldp.addScaledVector(vec, -this.params.sideSpeed)
        this.body.position.copy(oldp)
        this.setPosition()
        this.camera.cameraUpdate(this.perso.position)
        this.lerpOrientation()
      }
      if (this.moveRight) {
        vec.setFromMatrixColumn(this.perso.matrix, 0)
        let oldp = new Vector3().copy(this.body.position)
        oldp.addScaledVector(vec, this.params.sideSpeed)
        this.body.position.copy(oldp)
        this.setPosition()
        this.camera.cameraUpdate(this.perso.position)
        this.lerpOrientation()
      }
      if (this.mouse.grab === true) {
        this.speed = 0
        this.speedY = 0
        this.speed = -this.mouse.delta.x * this.params.cameraSpeedX
        this.speedY = this.mouse.delta.y * this.params.cameraSpeedY
      } else if (
        this.mouse.grab === false &&
        (Math.abs(this.speed) > 0 || Math.abs(this.speedY) > 0)
      ) {
        Math.sign(this.speed) * this.speed - this.params.deceleration > 0
          ? (this.speed -= Math.sign(this.speed) * this.params.deceleration)
          : (this.speed = 0)
        Math.sign(this.speedY) * this.speedY - this.params.deceleration > 0
          ? (this.speedY -= Math.sign(this.speedY) * this.params.deceleration)
          : (this.speedY = 0)
      }
      if (this.speedY) {
        if (
          this.camera.camera.position.y + this.speedY >
          this.params.cameraMaxY
        ) {
          this.camera.camera.position.y = this.params.cameraMaxY
          this.speedY = 0
        } else if (
          this.camera.camera.position.y + this.speedY <
          this.params.cameraMinY
        ) {
          this.camera.camera.position.y = this.params.cameraMinY
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
    const baseQuat = new Quaternion().copy(this.body.quaternion)
    if ( !baseQuat.equals( this.camera.container.quaternion ) ) {
      const step = this.params.lerpSpeed * this.time.delta
      this.perso.quaternion.rotateTowards( this.camera.container.quaternion, step )
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

    this.shape = threeToCannon(this.perso.children[0], {
      type: threeToCannon.Type.SPHERE,
    })
    this.body = new Body({
      mass: this.params.persoMass,
      position: this.center,
      shape: this.shape,
      allowSleep: false,
      angularDamping: 1,
      material: this.physic.groundMaterial,
    })
    this.physic.world.addBody(this.body)

    this.body.addEventListener('collide', (e) => {
      let contactNormal = new Vec3()
      let upAxis = new Vec3(0, 1, 0)
      let contact = e.contact
      if (contact.bi.id == this.body.id) contact.ni.negate(contactNormal)
      else contactNormal.copy(contact.ni)
      if (contactNormal.dot(upAxis) > 0.5) this.canJump = true
      if (!this.canJump) this.body.allowSleep = false
    })
  }
  setPosition() {
    this.perso.position.set(
      this.body.position.x - this.center.x,
      this.body.position.y - this.center.y,
      this.body.position.z - this.center.z
    )
  }
  setDebug() {
    if (this.debug) {
      this.debugFolder = this.debug.addFolder('Perso')
      this.debugFolder
        .add(this.params, 'deceleration')
        .name('Camera Deceleration')
        .min(0)
        .max(0.5)
        .step(0.02)
      this.debugFolder
        .add(this.params, 'cameraSpeedX')
        .name('Camera Speed X')
        .min(0)
        .max(0.5)
        .step(0.05)
      this.debugFolder
        .add(this.params, 'cameraSpeedY')
        .name('Camera Speed Y')
        .min(0)
        .max(0.5)
        .step(0.01)
      this.debugFolder
        .add(this.params, 'cameraMinY')
        .name('Camera Min Y')
        .min(0)
        .max(4)
        .step(0.1)
      this.debugFolder
        .add(this.params, 'cameraMaxY')
        .name('Camera Max Y')
        .min(0)
        .max(4)
        .step(0.1)
      this.debugFolder
        .add(this.params, 'lerpSpeed')
        .name('Rotation Lerp Duration')
        .min(0)
        .max(1)
        .step(0.001)
      this.debugFolder
        .add(this.params, 'frontSpeed')
        .name('Front Speed')
        .min(0)
        .max(1)
        .step(0.02)
      this.debugFolder
        .add(this.params, 'sideSpeed')
        .name('Side Speed')
        .min(0)
        .max(1)
        .step(0.02)
      this.debugFolder
        .add(this.params, 'jumpForce')
        .name('Jump Force')
        .min(0)
        .max(300)
        .step(10)
    }
  }
}
