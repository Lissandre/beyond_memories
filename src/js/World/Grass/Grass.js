import {Object3D, PlaneBufferGeometry, ShaderMaterial, Color, Mesh} from 'three'
import GrassFrag from '@shaders/Grass/GrassFrag.frag'
import GrassVert from '@shaders/Grass/GrassVert.vert'

export default class Grass {
    constructor(options) {

        this.time = options.time
        
        this.GFrequency = options.GFrequency
        this.GSpeed = options.GSpeed
        this.DepthColor = options.DepthColor
        this.SurfaceColor = options.SurfaceColor
        this.ColorOffset = options.ColorOffset
        this.ColorMultiplier = options.ColorMultiplier

        // Set up
        this.container = new Object3D()
    
        this.createGrass()
    }

    createGrass() {
        
        this.grassGeo = new PlaneBufferGeometry(4, 4, 1000, 1000)

        this.grassMat = new ShaderMaterial({
            vertexShader: GrassVert,
            fragmentShader: GrassFrag,
            uniforms: {
                uTime: {value: 0},
        
                uGrassFrequency: { value: this.GFrequency },
                uGrassSpeed: { value: this.GSpeed },
        
                uDepthColor: {value: new Color(this.DepthColor)},
                uSurfaceColor: {value: new Color(this.SurfaceColor)},
                uColorOffset: { value: this.ColorOffset },
                uColorMultiplier: { value: this.ColorMultiplier }
        
            }
        })

        this.grass = new Mesh(this.grassGeo, this.grassMat)

        this.grass.rotation.x = - Math.PI * 0.5

        this.container.add(this.grass)

        this.time.on('tick', () => {

            this.grassMat.uniforms.uTime.value += this.time.delta / 1000

        })
    }

} 