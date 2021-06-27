import {
  AnimationClip,
  AnimationMixer,
  Clock,
  Object3D,
  Vector3,
  CatmullRomCurve3,
  TubeGeometry,
  MeshLambertMaterial,
  BufferGeometry,
  Line,
  Skeleton,
} from 'three'

export default class Seagull {
  constructor(options) {
    // Set options
    this.time = options.time
    this.assets = options.assets
    this.curve = options.curve
    this.decal = options.decal
    this.xDecal = options.xDecal
    this.heightDecal = options.heightDecal
    this.lineVisible = options.lineVisible
    this.rotation = options.rotation
    this.speed = options.speed

    // Set up
    this.container = new Object3D()
    this.container.name = 'seagull'

    this.curves = []
    this.lineFollowing = new Vector3()

    this.setSeagull()
    this.animateSeagull()
  }

  setSeagull() {
    const cloneGltf = (gltf) => {
      const clone = {
        animations: gltf.animations,
        scene: gltf.scene.clone(true),
      }

      const skinnedMeshes = {}

      gltf.scene.traverse((node) => {
        if (node.isSkinnedMesh) {
          skinnedMeshes[node.name] = node
        }
      })

      const cloneBones = {}
      const cloneSkinnedMeshes = {}

      clone.scene.traverse((node) => {
        if (node.isBone) {
          cloneBones[node.name] = node
        }

        if (node.isSkinnedMesh) {
          cloneSkinnedMeshes[node.name] = node
        }
      })

      for (let name in skinnedMeshes) {
        const skinnedMesh = skinnedMeshes[name]
        const skeleton = skinnedMesh.skeleton
        const cloneSkinnedMesh = cloneSkinnedMeshes[name]

        const orderedCloneBones = []

        for (let i = 0; i < skeleton.bones.length; ++i) {
          const cloneBone = cloneBones[skeleton.bones[i].name]
          orderedCloneBones.push(cloneBone)
        }

        cloneSkinnedMesh.bind(
          new Skeleton(orderedCloneBones, skeleton.boneInverses),
          cloneSkinnedMesh.matrixWorld
        )
      }

      return clone
    }

    this.seagull = cloneGltf(this.assets.models.OISEAUX)
    // this.seagull.scale.set(0.2, 0.2, 0.2)
    this.seagull.scene.children[0].rotation.z = this.rotation

    this.seagull.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    this.container.add(this.seagull.scene)
  }

  animateSeagull() {
    const mixer = new AnimationMixer(this.seagull.scene)
    const clips = this.seagull.animations
    this.clock = new Clock()

    for (var i = 0; i < this.curve.length; i++) {
      var x = this.curve[i][0] + this.xDecal
      var y = this.curve[i][1] + this.decal
      var z = this.curve[i][2] + this.heightDecal
      this.curve[i] = new Vector3(x, z, -y)
    }

    this.curves.push(new CatmullRomCurve3(this.curve))

    this.points = this.curves[0].getPoints(50)
    this.geometry = new BufferGeometry().setFromPoints(this.points)

    this.tubeGeometry = new TubeGeometry(this.curves[0], 100, 2, 3, true)

    this.addGeometry(this.geometry)

    this.vectButter = new Vector3(this.curve.x, this.curve.y, this.curve.z)
    this.butterTarget = new Vector3(0, 0, 0)
    this.butterLook = new Vector3(0, 0, 0)

    this.time.on('tick', () => {
      mixer.update(this.clock.getDelta())

      this.nextPoint =
        Math.round(this.time.elapsed * this.speed) % this.points.length
      this.seagull.scene.position.lerp(this.points[this.nextPoint], 0.0025)
      this.seagull.scene.lookAt(this.points[this.nextPoint])
    })

    const clip = AnimationClip.findByName(clips, 'MOVEMENTS')
    const action = mixer.clipAction(clip)
    action.setEffectiveTimeScale(2)

    action.play()
  }

  addGeometry(geometry) {
    this.material = new MeshLambertMaterial({
      color: 0xff00ff,
      transparent: true,
      visible: this.lineVisible,
    })
    this.mesh = new Line(geometry, this.material)
    this.container.add(this.mesh)
  }
}
