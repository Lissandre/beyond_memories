import { Object3D, PlaneGeometry, ShaderMaterial, Mesh, Vector2, DoubleSide, Color } from "three"
import WaterFrag from '@shaders/WaterFrag.frag'
import WaterVert from '@shaders/WaterVert.vert'

const debugObject = {}
debugObject.depthColor = '#0000FF'
debugObject.surfaceColor = '#8888FF'

const params = {
    uBigWavesElevation: 0.5,
    uBigWavesFrequency: new Vector2(0.1, 0.1),
    uTime: 0,
    uBigWavesSpeed: 0.001, 
    uDepthColor: new Color(debugObject.depthColor),
    uSurfaceColor: new Color(debugObject.surfaceColor),
    uColorOffset: 0.25,
    uColorMultiplier: 2,
    uHeightWave: 2.0
}



export default class Water {
    constructor(options) {
        
        //Set options
        this.time = options.time
        this.debug = options.debug
        
        
        // Set up
        this.container = new Object3D()
        this.container.name = "water"
        
        this.createWater()
        this.setDebug()
        this.animateWater()
    }
    
    createWater() {
        
        this.geometry = new PlaneGeometry(200, 200, 512, 512);
        this.material = new ShaderMaterial({
            vertexShader: WaterVert,
            fragmentShader: WaterFrag,
            side: DoubleSide,
            uniforms:
            {
                uBigWavesElevation: { value: params.uBigWavesElevation },
                uBigWavesFrequency: { value: params.uBigWavesFrequency },
                uBigWavesSpeed: { value: params.uBigWavesSpeed},
                uHeightWave: { value: params.uHeightWave},

                uTime: { value: params.uTime},

                uDepthColor: { value: params.uDepthColor},
                uSurfaceColor: { value: params.uSurfaceColor},
                uColorOffset: { value: params.uColorOffset},
                uColorMultiplier: { value: params.uColorMultiplier},
            }
        });

        debugObject.depthColor = '#0000FF'
        debugObject.surfaceColor = '#8888FF'
        this.mesh = new Mesh(this.geometry, this.material);

        this.container.add(this.mesh)
        this.container.rotation.x = -Math.PI * 0.5
        // this.container.rotation.z = Math.PI*2
        // this.container.position.y = 
    }

    animateWater() {
        this.time.on('tick', ()=> {

            this.material.uniforms.uTime.value = this.time.elapsed
        })
    }

    setDebug() {
        this.debugFolder = this.debug.addFolder('Water')
        this.debugFolder
            .add(this.material.uniforms.uBigWavesElevation, 'value')
            .name('elevation of the water')
            .min(-10)
            .max(10)
            .step(0.1)
        this.debugFolder
            .add(this.material.uniforms.uHeightWave, 'value')
            .name('height of waves')
            .min(0)
            .max(10)
            .step(0.001)
        this.debugFolder
            .add(this.material.uniforms.uBigWavesSpeed, 'value')
            .name('speed of the water')
            .min(0)
            .max(0.001)
            .step(0.000001)
        this.debugFolder
            .add(this.material.uniforms.uBigWavesFrequency.value, 'x')
            .name('X frequency of the water')
            .min(-10)
            .max(10)
            .step(0.1)
        this.debugFolder
            .add(this.material.uniforms.uBigWavesFrequency.value, 'y')
            .name('Y frequency of the water')
            .min(-10)
            .max(10)
            .step(0.1)
        this.debugFolder
            .addColor(debugObject, 'depthColor')
            .name('Depth Color')
            .onChange(() => {
                this.material.uniforms.uDepthColor.value.set(debugObject.depthColor)
              })
        this.debugFolder
            .addColor(debugObject, 'surfaceColor')
            .name('Surface Color')
            .onChange(() => {
                this.material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
              })
        this.debugFolder
            .add(this.material.uniforms.uColorOffset, 'value')
            .name('color offset')
            .min(0)
            .max(2)
            .step(0.001)
        this.debugFolder
            .add(this.material.uniforms.uColorMultiplier, 'value')
            .name('color multiplier')
            .min(0)
            .max(10)
            .step(0.01)
            
      }
}