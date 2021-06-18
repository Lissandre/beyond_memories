import { AnimationClip, AnimationMixer, Clock, Object3D, Vector3 } from 'three'

export default class Seagull {
    constructor(options) {
        // Set options
        this.time =  options.time
        this.assets = options.assets
        this.curve = options.curve
    
        // Set up
        this.container = new Object3D()
        this.container.name = "seagull"
          
    
        this.setSeagull()
        this.animateSeagull()
    }

    setSeagull() {
        this.seagull = this.assets.models.OISEAUX.scene
        // this.seagull.scale.set(0.2, 0.2, 0.2)
        this.seagull.position.set(0,1,0)
        this.seagull.rotation.y = Math.PI/2
        this.seagull.castShadow = true
        this.container.add(this.seagull)
    }

    animateSeagull() {
        const mixer = new AnimationMixer( this.seagull)
        const clips = this.assets.models.OISEAUX.animations
        this.clock = new Clock()

        this.vectButter = new Vector3(this.curve.x, this.curve.y, this.curve.z)
        this.butterTarget = new Vector3(0, 0, 0)
        this.butterLook = new Vector3(0,0,0)

        let index = 0
        let count = 0

        console.log(this.clock.getDelta);

        this.time.on('tick', () => {
            mixer.update(this.clock.getDelta())
            // this.vectButter = new Vector3(this.curve[index][1], this.curve[index][2], this.curve[index][0])
            // this.butterTarget = this.vectButter
            // this.seagull.position.lerp(this.vectButter, 0.005)
            // this.butterLook.lerp(this.butterTarget, 0.005)
            // this.seagull.lookAt(this.butterLook.negate())
            
            // if(count === 80000) {
            //     count = 0
                
            // //    index = Math.floor(Math.random() * this.curve.length)
            // }
            
            // count++
            
        })

        const clip = AnimationClip.findByName(clips, 'MOVEMENTS')
        const action = mixer.clipAction(clip)
        action.setEffectiveTimeScale(2)

        action.play()
    }
}