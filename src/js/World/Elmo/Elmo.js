import {
  Clock,
  Object3D,
  Vector3,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  Box3,
  Box3Helper,
  AnimationMixer,
  AnimationUtils,
  Vector2,
} from 'three'
import { Capsule } from 'three/examples/jsm/math/Capsule'

export default class Elmo {
  constructor(options) {
    // Set options
    this.time = options.time
    this.assets = options.assets
    this.debug = options.debug
    this.worldOctree = options.worldOctree
    this.body = options.body
    this.camera = options.camera
    this.perso = options.perso

    // Set up
    this.container = new Object3D()
    this.container.name = 'Elmo'

    this.getPeted = false

    this.elmoCollider = new Capsule(
      new Vector3(0, 2, 0),
      new Vector3(0, 3.5, 0),
      0.35
    )
    this.elmoVelocity = new Vector3()
    this.elmoDirection = new Vector3()
    this.GRAVITY = 25
    this.speedP = 0
    this.clock = new Clock()

    this.crossFadeControls = []
    this.currentBaseAction = 'IDLE'
    this.allActions = []
    this.baseActions = {
      IDLE: { weight: 1 },
      WALKING: { weight: 0 },
      RUNNING: { weight: 0 },
      JUMP: { weight: 0 },
      CHEERING: { weight: 0 },
    }
<<<<<<< HEAD
    this.additiveActions = {
      // sneak_pose: { weight: 0 },
      // sad_pose: { weight: 0 },
      // agree: { weight: 0 },
      // headShake: { weight: 0 }
=======
    setElmo() {
      this.elmo = this.assets.models.elmo.scene
      this.elmo.children[0].rotation.set(0, 0, 0)
      this.elmo.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
      this.elmo.castShadow = true
      this.elmo.scale.set(0.4,0.4,0.4)
      this.elmo.position.set(8.5,15,-34.7)
  
      this.container.position.set(0,0,0)
      this.playerCollider = new Capsule(
        new Vector3(this.elmo.position.x, this.elmo.position.y, this.elmo.position.z),
        new Vector3(this.elmo.position.x, this.elmo.position.y + 0.5, this.elmo.position.z),
        0.5
        )
        
      this.container.add(this.elmo)
>>>>>>> put elmo in the cabane
    }

    this.setElmo()
    this.setCollider()
    this.animateElmo()
    this.setAnimation()

    //   this.setMovements()
    //   this.setDebug()
  }
  setElmo() {
    this.elmo = this.assets.models.elmo.scene
    this.elmo.children[0].rotation.set(0, 0, 0)
    this.elmo.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    this.elmo.castShadow = true
    this.elmo.scale.set(0.4, 0.4, 0.4)
    this.elmo.position.set(1, 2, 3)

    this.container.position.set(0, 0, 0)
    this.playerCollider = new Capsule(
      new Vector3(
        this.elmo.position.x,
        this.elmo.position.y,
        this.elmo.position.z
      ),
      new Vector3(
        this.elmo.position.x,
        this.elmo.position.y + 0.5,
        this.elmo.position.z
      ),
      0.5
    )

    this.container.add(this.elmo)
  }

  setCollider() {
    this.geometry = new BoxGeometry(2.5, 3, 2.5)
    this.material = new MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
      opacity: 0,
      transparent: true,
    })
    this.cube = new Mesh(this.geometry, this.material)
    this.cube.position.copy(this.elmo.position)
    this.elmoBB = new Box3().setFromObject(this.cube)
    const helper = new Box3Helper(this.elmoBB, 0xffff00)
    this.container.add(helper)
  }

  animateElmo() {
    this.time.on('tick', () => {
      this.persoPos = this.perso.perso.position
      this.nextTarget = new Vector3(
        this.persoPos.x - 2,
        this.persoPos.y,
        this.persoPos.z - 3
      )

      this.lookNext = new Vector3(
        this.perso.perso.position.x - 2,
        this.elmo.position.y,
        this.perso.perso.position.z - 1
      )

      this.elmoPos = new Vector2(this.elmo.position.x, this.elmo.position.z)
      this.nextPos = new Vector2(this.persoPos.x - 2, this.persoPos.z - 3)

      if (this.getPeted === true) {
        if (this.elmoPos.distanceTo(this.nextPos) <= 1.8) {
          this.speedP = 0
          this.elmo.lookAt(this.lookNext)
          if (this.currentBaseAction !== 'IDLE') {
            this.prepareCrossFade(
              this.baseActions[this.currentBaseAction].action,
              this.baseActions['IDLE'].action,
              0.6
            )
          }
        } else if (this.elmoPos.distanceTo(this.nextPos) >= 4) {
          this.speedP = 0.01
          this.elmo.lookAt(
            this.nextTarget.x,
            this.elmo.position.y,
            this.nextTarget.z
          )
          if (this.currentBaseAction !== 'RUNNING') {
            this.prepareCrossFade(
              this.baseActions[this.currentBaseAction].action,
              this.baseActions['RUNNING'].action,
              0.6
            )
          }
        } else if (this.elmoPos.distanceTo(this.nextPos) > 1.8) {
          this.speedP = 0.005
          this.elmo.lookAt(
            this.nextTarget.x,
            this.elmo.position.y,
            this.nextTarget.z
          )
          if (this.currentBaseAction !== 'WALKING') {
            this.prepareCrossFade(
              this.baseActions[this.currentBaseAction].action,
              this.baseActions['WALKING'].action,
              0.6
            )
          }
        }

        this.elmoVelocity.add(
          this.getForwardVector().multiplyScalar(this.speedP * this.time.delta)
        )
      }
      this.cube.position.copy(this.elmo.position)
      this.elmoBB.setFromObject(this.cube)
      const delta = Math.min(0.1, this.clock.getDelta())
      this.updateElmo(delta)
    })
  }

  elmoCollitions() {
    const result = this.worldOctree.capsuleIntersect(this.playerCollider)
    this.playerOnFloor = false
    if (result) {
      this.playerOnFloor = result.normal.y > 0
      if (!this.playerOnFloor) {
        this.elmoVelocity.addScaledVector(
          result.normal,
          -result.normal.dot(this.elmoVelocity)
        )
      }
      this.playerCollider.translate(result.normal.multiplyScalar(result.depth))
    }
  }

  updateElmo(delta) {
    if (this.playerOnFloor) {
      const damping = Math.exp(-3 * delta) - 1
      this.elmoVelocity.addScaledVector(this.elmoVelocity, damping)
    } else {
      this.elmoVelocity.y -= this.GRAVITY * delta
    }
    const deltaPosition = this.elmoVelocity.clone().multiplyScalar(delta)
    this.playerCollider.translate(deltaPosition)
    this.elmoCollitions()
    this.elmo.position.set(
      this.playerCollider.start.x,
      this.playerCollider.start.y - 0.5,
      this.playerCollider.start.z
    )
  }

  getForwardVector() {
    this.elmo.getWorldDirection(this.elmoDirection)
    this.elmoDirection.y = 0
    this.elmoDirection.normalize()
    return this.elmoDirection
  }
  getSideVector() {
    this.elmo.getWorldDirection(this.elmoDirection)
    this.elmoDirection.y = 0
    this.elmoDirection.normalize()
    this.elmoDirection.cross(this.elmo.up)
    return this.elmoDirection
  }

  setAnimation() {
    const animations = this.assets.models.elmo.animations
    this.mixer = new AnimationMixer(this.assets.models.elmo.scene)
    this.numAnimations = animations.length
    for (let i = 0; i !== this.numAnimations; ++i) {
      let clip = animations[i]
      const name = clip.name
      if (this.baseActions[name]) {
        const action = this.mixer.clipAction(clip)
        this.activateAction(action)
        action.setEffectiveTimeScale(0.2)
        this.baseActions[name].action = action
        this.allActions.push(action)
      } else if (this.additiveActions[name]) {
        // Make the clip additive and remove the reference frame
        AnimationUtils.makeClipAdditive(clip)
        if (clip.name.endsWith('_pose')) {
          clip = AnimationUtils.subclip(clip, clip.name, 2, 3, 30)
        }
        const action = this.mixer.clipAction(clip)
        this.activateAction(action)
        this.additiveActions[name].action = action
        this.allActions.push(action)
      }
    }
    this.animate()
  }

  activateAction(action) {
    const clip = action.getClip()
    const settings =
      this.baseActions[clip.name] || this.additiveActions[clip.name]
    this.setWeight(action, settings.weight)
    action.play()
  }
  prepareCrossFade(startAction, endAction, duration) {
    // If the current action is 'idle', execute the crossfade immediately;
    // else wait until the current action has finished its current loop
    // if (this.currentBaseAction === 'JUMP') {
    //   this.synchronizeCrossFade(startAction, endAction, duration)
    // } else {
    this.executeCrossFade(startAction, endAction, duration)
    // }
    // Update control colors
    if (endAction) {
      const clip = endAction.getClip()
      this.currentBaseAction = clip.name
    } else {
      this.currentBaseAction = 'None'
    }
    this.crossFadeControls.forEach(function (control) {
      const name = control.property
      if (name === this.currentBaseAction) {
        control.setActive()
      } else {
        control.setInactive()
      }
    })
  }
  synchronizeCrossFade(startAction, endAction, duration) {
    this.mixer.addEventListener('loop', onLoopFinished)
    const that = this
    function onLoopFinished(event) {
      if (event.action === startAction) {
        that.mixer.removeEventListener('loop', onLoopFinished)
        that.executeCrossFade(startAction, endAction, duration)
      }
    }
  }
  executeCrossFade(startAction, endAction, duration) {
    // Not only the start action, but also the end action must get a weight of 1 before fading
    // (concerning the start action this is already guaranteed in this place)
    if (endAction) {
      this.setWeight(endAction, 1)
      endAction.time = 0
      if (startAction) {
        // Crossfade with warping
        startAction.crossFadeTo(endAction, duration, true)
      } else {
        // Fade in
        endAction.fadeIn(duration)
      }
    } else {
      // Fade out
      startAction.fadeOut(duration)
    }
  }
  // This function is needed, since animationAction.crossFadeTo() disables its start action and sets
  // the start action's timeScale to ((start animation's duration) / (end animation's duration))
  setWeight(action, weight) {
    action.enabled = true
    action.setEffectiveTimeScale(1)
    action.setEffectiveWeight(weight)
  }
  animate() {
    // Render loop
    this.time.on('tick', () => {
      // requestAnimationFrame(this.animate())
      for (let i = 0; i !== this.numAnimations; ++i) {
        const action = this.allActions[i]
        const clip = action.getClip()
        const settings =
          this.baseActions[clip.name] || this.additiveActions[clip.name]
        settings.weight = action.getEffectiveWeight()
      }
      // Get the time elapsed since the last frame, used for this.mixer update
      const mixerUpdateDelta = this.time.delta / 1500
      // Update the animation this.mixer, the stats panel, and render this frame
      this.mixer.update(mixerUpdateDelta)
    })
  }
}
