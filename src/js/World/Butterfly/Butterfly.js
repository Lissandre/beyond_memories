import { AnimationClip, AnimationMixer, Clock, Object3D, Vector3 } from 'three'

export default class Butterfly {
    constructor(options) {
        // Set options
        this.time =  options.time
        this.assets = options.assets
    
        // Set up
        this.container = new Object3D()
        this.container.name = "papillon de lumière"

        this.curve = [
            [0.22757530212402344, -2.221489429473877, 1],
            [0.22757530212402344, -2.221489429473877, 1],
            [-1.8654354810714722, -4.528411388397217, 1],
            [-4.785167694091797, -7.040308952331543, 1],
            [-7.4153642654418945, -7.535991191864014, 1],
            [-9.737287521362305, -7.310304164886475, 1],
            [-11.392159461975098, -6.660364627838135, 1],
            [-12.330945014953613, -5.16754150390625, 1],
            [-12.177045822143555, -2.9667816162109375, 1],
            [-10.638052940368652, 0.6344614028930664, 1],
            [-7.59529972076416, 4.540771961212158, 1],
            [-3.8008956909179688, 5.488203525543213, 1],
            [-0.7774209976196289, 4.188275337219238, 1],
            [1.0232001543045044, 1.0641200542449951, 1],
            [12.1620547771453857, -0.0138654708862305, 1],
            [5.2728655338287354, -11.17099666595459, 1],
            [-8.22275161743164, -11.026939392089844, 1],
            [-7.304580211639404, -2.692131757736206, 1],
            [-13.927192687988281, -0.6309871673583984, 1],
            [-13.942583084106445, 6.00206995010376, 1.2705764770507812],
            [-5.803896903991699, 9.718185424804688, 1.0827462673187256],
            [1.8961199522018433, 6.00206995010376, 1],
            [2.0, 0.0, -0.18960541486740112],
        ]
          
    
        this.setButterfly()
        this.animateButterfly()
    }

    setButterfly() {
        this.butterfly = this.assets.models.Butterfly.scene
        this.butterfly.scale.set(0.2, 0.2, 0.2)
        this.butterfly.position.set(0,1,0)
        this.butterfly.rotation.y = Math.PI/2
        this.butterfly.castShadow = true
        this.container.add(this.butterfly)
    }

    animateButterfly() {
        const mixer = new AnimationMixer( this.butterfly)
        const clips = this.assets.models.Butterfly.animations
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
            this.butterfly.position.lerp(this.vectButter, 0.005)
            this.butterLook.lerp(this.butterTarget, 0.005)
            this.butterfly.lookAt(this.butterLook.negate())
            
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