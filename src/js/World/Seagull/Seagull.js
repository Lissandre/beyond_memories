import { AnimationClip, AnimationMixer, Clock, Object3D, Vector3, CatmullRomCurve3, TubeGeometry, Mesh, MeshLambertMaterial, BufferGeometry, Line } from 'three'

export default class Seagull {
    constructor(options) {
        // Set options
        this.time =  options.time
        this.assets = options.assets
        this.curve = options.curve
        this.decal = options.decal
        this.heightDecal = options.heightDecal
        this.lineVisible = options.lineVisible
        this.rotation = options.rotation
    
        // Set up
        this.container = new Object3D()
        this.container.name = "seagull"

        this.curves = []
        this.lineFollowing = new Vector3()

          
    
        this.setSeagull()
        this.animateSeagull()
    }

    setSeagull() {
        this.seagull = this.assets.models.OISEAUX.scene
        // this.seagull.scale.set(0.2, 0.2, 0.2)
        
        this.seagull.children[0].rotation.z = this.rotation
        this.seagull.castShadow = true
        this.container.add(this.seagull)
    }

    animateSeagull() {
        const mixer = new AnimationMixer(this.seagull)
        const clips = this.assets.models.OISEAUX.animations
        this.clock = new Clock()

        for (var i = 0; i < this.curve.length; i++) {
            var x = this.curve[i][0] 
            var y = this.curve[i][1] + this.decal
            var z = this.curve[i][2] + this.heightDecal
            this.curve[i] = new Vector3(x, z, -y)
         }

        this.curves.push(new CatmullRomCurve3(this.curve))
        
        this.points = this.curves[0].getPoints(50)
        this.geometry = new BufferGeometry().setFromPoints( this.points );

        this.tubeGeometry = new TubeGeometry( this.curves[0], 100, 2, 3, true );

        this.addGeometry( this.geometry );


        this.vectButter = new Vector3(this.curve.x, this.curve.y, this.curve.z)
        this.butterTarget = new Vector3(0, 0, 0)
        this.butterLook = new Vector3(0,0,0)

        this.time.on('tick', () => {
            mixer.update(this.clock.getDelta())

            this.nextPoint = Math.round((this.time.elapsed * 0.001)) % this.points.length
            this.seagull.position.lerp(this.points[this.nextPoint], 0.0025)
            this.seagull.lookAt(this.points[this.nextPoint])
            
            
            
        })

        const clip = AnimationClip.findByName(clips, 'MOVEMENTS')
        const action = mixer.clipAction(clip)
        action.setEffectiveTimeScale(2)

        action.play()
    }

    addGeometry(geometry) {
        this.material = new MeshLambertMaterial( { color: 0xff00ff, transparent: true, visible: this.lineVisible } );
        this.mesh = new Line( geometry, this.material );
        this.container.add( this.mesh );
    }
}