
import { AnimationClip, AnimationMixer, Clock, Object3D, Vector3 } from 'three'

export default class Butterfly {
    constructor(options) {
        // Set options
        this.time =  options.time
        this.assets = options.assets
        this.curve = options.curve
    
        // Set up
        this.container = new Object3D()
        this.container.name = "papillon de lumière"
    
        this.setButterfly()
        this.animateButterfly()
    }

    setButterfly() {

        const cloneGltf = (gltf) => {
            const clone = {
              animations: gltf.animations,
              scene: gltf.scene.clone(true)
            };
          
            const skinnedMeshes = {};
          
            gltf.scene.traverse(node => {
              if (node.isSkinnedMesh) {
                skinnedMeshes[node.name] = node;
              }
            });
          
            const cloneBones = {};
            const cloneSkinnedMeshes = {};
          
            clone.scene.traverse(node => {
              if (node.isBone) {
                cloneBones[node.name] = node;
              }
          
              if (node.isSkinnedMesh) {
                cloneSkinnedMeshes[node.name] = node;
              }
            });
          
            for (let name in skinnedMeshes) {
              const skinnedMesh = skinnedMeshes[name];
              const skeleton = skinnedMesh.skeleton;
              const cloneSkinnedMesh = cloneSkinnedMeshes[name];
          
              const orderedCloneBones = [];
          
              for (let i = 0; i < skeleton.bones.length; ++i) {
                const cloneBone = cloneBones[skeleton.bones[i].name];
                orderedCloneBones.push(cloneBone);
              }
          
              cloneSkinnedMesh.bind(
                  new Skeleton(orderedCloneBones, skeleton.boneInverses),
                  cloneSkinnedMesh.matrixWorld);
            }
          
            return clone;
          }


          this.butterfly = cloneGltf(this.assets.models.Butterfly)

        this.butterfly.scene.scale.set(0.2, 0.2, 0.2)
        this.butterfly.scene.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true
              child.receiveShadow = true
            }
          })
          this.container.add(this.butterfly.scene)
        }
        
    animateButterfly() {
        const mixer = new AnimationMixer( this.butterfly.scene)
        const clips = this.butterfly.animations
        this.clock = new Clock()

        this.vectButter = new Vector3(this.curve.x, this.curve.y, this.curve.z)
        this.butterTarget = new Vector3(0, 0, 0)
        this.butterLook = new Vector3(0,0,0)

        let index = 0
        let count = 200

        this.time.on('tick', () => {
            mixer.update(this.clock.getDelta())
            this.vectButter = new Vector3(this.curve[index][1], this.curve[index][2], this.curve[index][0])
            this.butterTarget = this.vectButter
            this.butterfly.scene.position.lerp(this.vectButter, 0.005)
            this.butterLook.lerp(this.butterTarget, 0.01)
            this.butterfly.scene.lookAt(this.butterLook.negate())
            
            if(count === 240) {
                count = 0
                
               index = Math.floor(Math.random() * this.curve.length)
            }
            
            count++
            
        })

        const clip = AnimationClip.findByName(clips, 'KeyAction')
        const action = mixer.clipAction(clip)
        
        action.play()
    }
}