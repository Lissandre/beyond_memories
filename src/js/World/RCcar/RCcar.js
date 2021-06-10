import {
  Clock,
  Object3D,
  Vector3,
  Quaternion,
  Euler,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  AnimationUtils,
  AnimationMixer
} from 'three'
import { Capsule } from 'three/examples/jsm/math/Capsule'

import Mouse from '@tools/Mouse'

export default class RCcar {
    constructor(options) {

        this.time = options.time
        this.assets = options.assets
        this.cameraCar = options.cameraCar
        this.watchCar = options.watchCar
        this.appThis = options.appThis
        this.worldOctree = options.worldOctree
    
        // Set up
        this.container = new Object3D()
    
        this.playerCollider = new Capsule(new Vector3(0, 0, 0), new Vector3(0, 1.5, 0), 0.35)
        this.playerVelocity = new Vector3()
        this.playerDirection = new Vector3()
        this.GRAVITY = 30
        this.speedP = 0.005
        this.clock = new Clock()
    
        this.crossFadeControls = []
        this.currentBaseAction = 'IDLE'
        this.allActions = []
        this.baseActions = {
          IDLE: { weight: 1 },
          WALKING: { weight: 0 },
          RUNNING: { weight: 0 }
        }
        this.additiveActions = {
          // sneak_pose: { weight: 0 },
          // sad_pose: { weight: 0 },
          // agree: { weight: 0 },
          // headShake: { weight: 0 }
        }
    
        this.mouse = new Mouse()
        this.moveForward = false
        this.moveBackward = false
        this.moveLeft = false
        this.moveRight = false
        this.rotation = 0
        this.speed = 0
        this.params = {
          deceleration: 0.12,
          cameraSpeedX: 0.1,
          cameraSpeedY: 0.01,
          cameraMaxY: 3,
          cameraMinY: 0.5,
          lerpSpeed: 0.005,
        }
    

        this.setCar()
        this.setListeners()
        this.setMovements()
    }

    setCar() {
        this.car = this.assets.models.car.scene
        this.car.scale.set(0.1, 0.1, 0.1)
        this.car.castShadow = true
        this.container.add(this.car)
        this.container.position.set(5,0,-10)
        
        this.setCollider()
    }

    setCollider() {
        this.geometry = new BoxGeometry( 4, 4, 4 );
        this.material = new MeshBasicMaterial( {color: 0x00ff00, wireframe: true} );
        this.cube = new Mesh( this.geometry, this.material )
        this.cube.position.set(0,1,0)
        this.container.add(this.cube)
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
              if (this.playerOnFloor) {
                // this.body.allowSleep = false
                this.playerVelocity.y = 8;
              }
              this.playerOnFloor = false
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
          if (this.currentBaseAction != 'IDLE' && this.moveForward == false && this.moveBackward == false && this.moveLeft == false && this.moveRight == false) {
            this.prepareCrossFade( this.baseActions[this.currentBaseAction].action, this.baseActions['IDLE'].action, 1.2 )
          }
        },
        false
      )
    }
    setMovements() {
      this.time.on('tick', () => {
        if(this.appThis.watchCar === true) {
          if (this.moveForward) {
            this.playerVelocity.add( this.getForwardVector().multiplyScalar( - this.speedP * this.time.delta ) )
            this.cameraCar.cameraUpdate(this.car.position)
            this.cube.position.set(this.car.position.x, 1, this.car.position.z)
            this.lerpOrientation()
            // if (this.currentBaseAction != 'RUNNING') {
            //   this.prepareCrossFade( this.baseActions[this.currentBaseAction].action, this.baseActions['RUNNING'].action, 0.6 )
            //   // this.baseActions['RUNNING'].action.setEffectiveTimeScale( 0.0005 )
            // }
          }
          if (this.moveBackward) {
            this.playerVelocity.add( this.getForwardVector().multiplyScalar( this.speedP * this.time.delta ) )
            this.cameraCar.cameraUpdate(this.car.position)
            this.cube.position.set(this.car.position.x, 1, this.car.position.z)
            this.lerpOrientation()
            // if (this.currentBaseAction != 'RUNNING') {
            //   this.prepareCrossFade( this.baseActions[this.currentBaseAction].action, this.baseActions['RUNNING'].action, 0.6 )
            //   // this.baseActions['RUNNING'].action.setEffectiveTimeScale( 0.0005 )
            // }
          }
          if (this.moveLeft) {
            this.playerVelocity.add( this.getSideVector().multiplyScalar( this.speedP * this.time.delta ) )
            this.cameraCar.cameraUpdate(this.car.position)
            this.cube.position.set(this.car.position.x, 1, this.car.position.z)
            this.lerpOrientation()
            // if (this.currentBaseAction != 'RUNNING') {
            //   this.prepareCrossFade( this.baseActions[this.currentBaseAction].action, this.baseActions['RUNNING'].action, 0.6 )
            //   // this.baseActions['RUNNING'].action.setEffectiveTimeScale( 0.0005 )
            // }
          }
          if (this.moveRight) {
            this.playerVelocity.add( this.getSideVector().multiplyScalar( - this.speedP * this.time.delta ) )
            this.cameraCar.cameraUpdate(this.car.position)
            this.cube.position.set(this.car.position.x, 1, this.car.position.z)
            this.lerpOrientation()
            // if (this.currentBaseAction != 'RUNNING') {
            //   this.prepareCrossFade( this.baseActions[this.currentBaseAction].action, this.baseActions['RUNNING'].action, 0.6 )
            //   // this.baseActions['RUNNING'].action.setEffectiveTimeScale( 0.0005 )
            // }
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
              this.cameraCar.camera.position.y + this.speedY >
              this.params.cameraMaxY
            ) {
              this.cameraCar.camera.position.y = this.params.cameraMaxY
              this.speedY = 0
            } else if (
              this.cameraCar.camera.position.y + this.speedY <
              this.params.cameraMinY
            ) {
              this.cameraCar.camera.position.y = this.params.cameraMinY
              this.speedY = 0
            } else {
              this.cameraCar.camera.position.y += this.speedY
            }
          }
          // this.cameraCar.camera.lookAt(this.cameraCar.container.position)
          this.deltaRotationQuaternion = new Quaternion().setFromEuler(
            new Euler(0, this.toRadians(this.speed), 0, 'XYZ')
          )
          this.cameraCar.container.quaternion.multiplyQuaternions(
            this.deltaRotationQuaternion,
            this.cameraCar.container.quaternion
          )
    
          const delta = Math.min( 0.1, this.clock.getDelta() )
          this.updatePlayer(delta)
        }
      })
    }
    lerpOrientation() {
      const baseQuat = new Quaternion().copy(this.cameraCar.container.quaternion)
      if ( !baseQuat.equals( this.car.quaternion ) ) {
        const step = this.params.lerpSpeed * this.time.delta
        this.car.quaternion.rotateTowards( this.cameraCar.container.quaternion, step )
      }
    }
    toRadians(angle) {
      return angle * (Math.PI / 180)
    }
    playerCollitions() {
      const result = this.worldOctree.capsuleIntersect( this.playerCollider )
      this.playerOnFloor = false
      if ( result ) {
        this.playerOnFloor = result.normal.y > 0
        if ( ! this.playerOnFloor ) {
          this.playerVelocity.addScaledVector( result.normal, - result.normal.dot( this.playerVelocity ) )
        }
        this.playerCollider.translate( result.normal.multiplyScalar( result.depth ) )
      }
    }
    updatePlayer(delta) {
      if ( this.playerOnFloor ) {
        const damping = Math.exp( - 3 * delta ) - 1
        this.playerVelocity.addScaledVector( this.playerVelocity, damping )
      } else {
        this.playerVelocity.y -= this.GRAVITY * delta
      }
      const deltaPosition = this.playerVelocity.clone().multiplyScalar( delta )
      this.playerCollider.translate( deltaPosition )
      this.playerCollitions()
      this.cameraCar.container.position.copy( this.playerCollider.start )
      this.car.position.set(this.cameraCar.container.position.x, this.cameraCar.container.position.y - 0.35, this.cameraCar.container.position.z)
    }
    getForwardVector() {
      this.cameraCar.container.getWorldDirection( this.playerDirection )
      this.playerDirection.y = 0
      this.playerDirection.normalize()
      return this.playerDirection
    }
    getSideVector() {
      this.cameraCar.container.getWorldDirection( this.playerDirection )
      this.playerDirection.y = 0
      this.playerDirection.normalize()
      this.playerDirection.cross( this.cameraCar.container.up )
      return this.playerDirection
    }
      
}