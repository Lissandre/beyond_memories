import {Object3D, TextureLoader, BufferGeometry, Float32BufferAttribute, PointsMaterial, AdditiveBlending, Points} from 'three'
import imageFlare from '@textures/flare.png'

export default class Flare {
    constructor(options) {
        // Set options
        this.time = options.time
        this.assets = options.assets

        this.container = new Object3D()
        this.container.name = "particule"
    
        this.setFlare()
    }

    setFlare() {

        const geometry = new BufferGeometry();
		const vertices = [];

        for ( let i = 0; i < 300; i ++ ) {

            const x = (Math.random() * 2000 - 1000)/8;
					const y = Math.random()*10;
					const z = (Math.random() * 2000 - 1000)/8;

            vertices.push( x, y, z );

        }

        geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) )
        this.materials = new PointsMaterial( { size: 0.3, map: this.assets.textures.flare, blending: AdditiveBlending, depthTest: true, transparent: true } )
        this.particles = new Points( geometry, this.materials)

        this.container.add(this.particles)
        this.count = 0

        this.time.on('tick', ()=>{
            this.count += 0.007
            this.container.position.y = Math.sin(this.count)/5
            this.container.position.x = Math.cos(this.count)/5
            this.container.rotation.y = Math.sin(this.count)/100
        })
    }
}