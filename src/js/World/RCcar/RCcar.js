import { Object3D, BoxGeometry, MeshBasicMaterial, Mesh, Vector3, Clock, SphereGeometry, MeshStandardMaterial, Sphere } from 'three'

export default class RCcar {
    constructor(options) {

        this.time = options.time
        this.assets = options.assets
        this.cameraCar = options.cameraCar
        this.worldOctree = options.worldOctree

        this.container = new Object3D()
        this.container.name = "car"

        const SPHERE_RADIUS = 0.2;
        this.sphereGeometry = new SphereGeometry( SPHERE_RADIUS, 32, 32 );
        this.sphereMaterial = new MeshBasicMaterial( {color: 0x0000FF, wireframe: true} );
        this.sphereMesh = new Mesh(this.sphereGeometry, this.sphereMaterial)

        this.carVelocity = new Vector3()
        this.carDirection = new Vector3()
        this.carCollider = new Sphere( new Vector3( 0, - 100, 0 ), SPHERE_RADIUS )
        this.GRAVITY = 30
        this.speedP = 5
        this.clock = new Clock()

        this.sphere = {
            mesh: this.sphere,
            velocity: this.carVelocity,
            collider: this.carCollider
        }
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
                this.carVelocity.add( this.getForwardVector().multiplyScalar( this.speedP * this.time.delta ) );
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
            // if (this.currentBaseAction != 'IDLE' && this.moveForward == false && this.moveBackward == false && this.moveLeft == false && this.moveRight == false) {
            //   this.prepareCrossFade( this.baseActions[this.currentBaseAction].action, this.baseActions['IDLE'].action, 1.2 )
            // }
          },
          false
        )
      }

      setMovements() {
        this.time.on('tick', () => {
          if (this.moveForward) {
            this.carVelocity.add( this.getForwardVector().multiplyScalar( - this.speedP * this.time.delta ) )
            console.log('car move forward');
            this.lerpOrientation()
            // if (this.currentBaseAction != 'RUNNING') {
            //   this.prepareCrossFade( this.baseActions[this.currentBaseAction].action, this.baseActions['RUNNING'].action, 0.6 )
            //   // this.baseActions['RUNNING'].action.setEffectiveTimeScale( 0.0005 )
            // }
          }
          if (this.moveBackward) {
            this.carVelocity.add( this.getForwardVector().multiplyScalar( this.speedP * this.time.delta ) )
            this.lerpOrientation()
            // if (this.currentBaseAction != 'RUNNING') {
            //   this.prepareCrossFade( this.baseActions[this.currentBaseAction].action, this.baseActions['RUNNING'].action, 0.6 )
            //   // this.baseActions['RUNNING'].action.setEffectiveTimeScale( 0.0005 )
            // }
          }
          if (this.moveLeft) {
            this.carVelocity.add( this.getSideVector().multiplyScalar( this.speedP * this.time.delta ) )
            this.lerpOrientation()
            // if (this.currentBaseAction != 'RUNNING') {
            //   this.prepareCrossFade( this.baseActions[this.currentBaseAction].action, this.baseActions['RUNNING'].action, 0.6 )
            //   // this.baseActions['RUNNING'].action.setEffectiveTimeScale( 0.0005 )
            // }
          }
          if (this.moveRight) {
            this.carVelocity.add( this.getSideVector().multiplyScalar( - this.speedP * this.time.delta ) )
            this.lerpOrientation()
            // if (this.currentBaseAction != 'RUNNING') {
            //   this.prepareCrossFade( this.baseActions[this.currentBaseAction].action, this.baseActions['RUNNING'].action, 0.6 )
            //   // this.baseActions['RUNNING'].action.setEffectiveTimeScale( 0.0005 )
            // }
          }
        //   if (this.mouse.grab === true) {
        //     this.speed = 0
        //     this.speedY = 0
        //     this.speed = -this.mouse.delta.x * this.params.cameraSpeedX
        //     this.speedY = this.mouse.delta.y * this.params.cameraSpeedY
        //   } else if (
        //     this.mouse.grab === false &&
        //     (Math.abs(this.speed) > 0 || Math.abs(this.speedY) > 0)
        //   ) {
        //     Math.sign(this.speed) * this.speed - this.params.deceleration > 0
        //       ? (this.speed -= Math.sign(this.speed) * this.params.deceleration)
        //       : (this.speed = 0)
        //     Math.sign(this.speedY) * this.speedY - this.params.deceleration > 0
        //       ? (this.speedY -= Math.sign(this.speedY) * this.params.deceleration)
        //       : (this.speedY = 0)
        //   }
        //   if (this.speedY) {
        //     if (
        //       this.camera.camera.position.y + this.speedY >
        //       this.params.cameraMaxY
        //     ) {
        //       this.camera.camera.position.y = this.params.cameraMaxY
        //       this.speedY = 0
        //     } else if (
        //       this.camera.camera.position.y + this.speedY <
        //       this.params.cameraMinY
        //     ) {
        //       this.camera.camera.position.y = this.params.cameraMinY
        //       this.speedY = 0
        //     } else {
        //       this.camera.camera.position.y += this.speedY
        //     }
        //   }
        //   this.camera.camera.lookAt(this.camera.container.position)
        //   this.deltaRotationQuaternion = new Quaternion().setFromEuler(
        //     new Euler(0, this.toRadians(this.speed), 0, 'XYZ')
        //   )
        //   this.camera.container.quaternion.multiplyQuaternions(
        //     this.deltaRotationQuaternion,
        //     this.camera.container.quaternion
        //   )
    
          const delta = Math.min( 0.1, this.clock.getDelta() )
          this.updateCar(delta)
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

      updateCar( delta ) {

        if ( this.carOnFloor ) {

            const damping = Math.exp( - 3 * delta ) - 1;
            this.carVelocity.addScaledVector( this.carVelocity, damping );

        } else {

            this.carVelocity.y -= this.GRAVITY * delta;

        }

        const deltaPosition = this.carVelocity.clone().multiplyScalar( delta );
        this.carCollider.translate( deltaPosition );

        this.carCollitions();

        this.cameraCar.camera.position.copy( this.carCollider );

    }

      carCollitions() {

        const result = this.worldOctree.sphereIntersect( this.carCollider );

        this.carOnFloor = false;

        if ( result ) {

            this.carOnFloor = result.normal.y > 0;

            if ( ! carOnFloor ) {

                this.carVelocity.addScaledVector( result.normal, - result.normal.dot( this.carVelocity ) );

            }

            this.carCollider.translate( result.normal.multiplyScalar( result.depth ) );

        }

    }

    getForwardVector() {

        this.cameraCar.container.getWorldDirection( this.carDirection );
        this.carDirection.y = 0;
        this.carDirection.normalize();

        return this.carDirection;

    }

    getSideVector() {

        this.cameraCar.container.getWorldDirection( this.carDirection );
        this.carDirection.y = 0;
        this.carDirection.normalize();
        this.carDirection.cross( this.cameraCar.container.up );

        return this.carDirection;

    }

      
}