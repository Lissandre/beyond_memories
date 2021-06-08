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
import * as THREE from 'three'
import Mouse from '@tools/Mouse'
// import { TweenMax } from 'gsap'

export default class Perso {
  constructor(options) {
    // Set options
    this.time = options.time
    this.assets = options.assets
    this.camera = options.camera
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
    this.setListeners()
    this.setMovements()
    this.setDebug()
  }
  setPerso() {
    this.perso = this.assets.models.Xbot.scene
    this.perso.scale.set(0.5, 0.5, 0.5)
    this.perso.children[0].rotation.set(0, Math.PI, 0)
    this.perso.castShadow = true
    this.container.add(this.perso)
    console.log(this.assets.models.elmo);
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
      }
      if (this.moveBackward) {
      }
      if (this.moveLeft) {
      }
      if (this.moveRight) {
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

  setAnimations() {
    const crossFadeControls = []

      let currentBaseAction = 'idle'
      const allActions = []
      const baseActions = {
        idle: { weight: 1 },
        walk: { weight: 0 },
        run: { weight: 0 }
      }
      const additiveActions = {
        sneak_pose: { weight: 0 },
        sad_pose: { weight: 0 },
        agree: { weight: 0 },
        headShake: { weight: 0 }
      }
      let panelSettings, numAnimations

      const animations = gltf.animations;
          mixer = new THREE.AnimationMixer( this.assets.models.elmo )

          numAnimations = animations.length

          for ( let i = 0; i !== numAnimations; ++ i ) {

            let clip = animations[ i ]
            const name = clip.name

            if ( baseActions[ name ] ) {

              const action = mixer.clipAction( clip )
              this.activateAction( action )
              baseActions[ name ].action = action
              allActions.push( action )

            } else if ( additiveActions[ name ] ) {

              // Make the clip additive and remove the reference frame

              THREE.AnimationUtils.makeClipAdditive( clip )

              if ( clip.name.endsWith( '_pose' ) ) {

                clip = THREE.AnimationUtils.subclip( clip, clip.name, 2, 3, 30 )

              }

              const action = mixer.clipAction( clip )
              this.activateAction( action )
              additiveActions[ name ].action = action
              allActions.push( action )

            }

          }
          this.animate()

  }
  activateAction( action ) {

    const clip = action.getClip();
    const settings = baseActions[ clip.name ] || additiveActions[ clip.name ];
    this.setWeight( action, settings.weight );
    action.play();

  }
  prepareCrossFade( startAction, endAction, duration ) {

    // If the current action is 'idle', execute the crossfade immediately;
    // else wait until the current action has finished its current loop

    if ( currentBaseAction === 'idle' || ! startAction || ! endAction ) {

      this.executeCrossFade( startAction, endAction, duration );

    } else {

      this.synchronizeCrossFade( startAction, endAction, duration );

    }

    // Update control colors

    if ( endAction ) {

      const clip = endAction.getClip();
      currentBaseAction = clip.name;

    } else {

      currentBaseAction = 'None';

    }

    crossFadeControls.forEach( function ( control ) {

      const name = control.property;

      if ( name === currentBaseAction ) {

        control.setActive();

      } else {

        control.setInactive();

      }

    } );

  }

  synchronizeCrossFade( startAction, endAction, duration ) {

    mixer.addEventListener( 'loop', onLoopFinished );

    function onLoopFinished( event ) {

      if ( event.action === startAction ) {

        mixer.removeEventListener( 'loop', onLoopFinished );

        this.executeCrossFade( startAction, endAction, duration );

      }

    }

  }

  executeCrossFade( startAction, endAction, duration ) {

    // Not only the start action, but also the end action must get a weight of 1 before fading
    // (concerning the start action this is already guaranteed in this place)

    if ( endAction ) {

      this.setWeight( endAction, 1 );
      endAction.time = 0;

      if ( startAction ) {

        // Crossfade with warping

        startAction.crossFadeTo( endAction, duration, true );

      } else {

        // Fade in

        endAction.fadeIn( duration );

      }

    } else {

      // Fade out

      startAction.fadeOut( duration );

    }

  }

  // This function is needed, since animationAction.crossFadeTo() disables its start action and sets
  // the start action's timeScale to ((start animation's duration) / (end animation's duration))

  setWeight( action, weight ) {

    action.enabled = true;
    action.setEffectiveTimeScale( 1 );
    action.setEffectiveWeight( weight );

  }
  animate() {

    // Render loop

    requestAnimationFrame( animate );

    for ( let i = 0; i !== numAnimations; ++ i ) {

      const action = allActions[ i ];
      const clip = action.getClip();
      const settings = baseActions[ clip.name ] || additiveActions[ clip.name ];
      settings.weight = action.getEffectiveWeight();

    }

    // Get the time elapsed since the last frame, used for mixer update

    const mixerUpdateDelta = clock.getDelta();

    // Update the animation mixer, the stats panel, and render this frame

    mixer.update( mixerUpdateDelta );
  }
}
