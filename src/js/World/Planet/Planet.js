import {Object3D, Color, UniformsUtils} from 'three'
import { fogParsVert, fogVert, fogParsFrag, fogFrag } from '@shaders/FogReplace'

export default class Planet {
    constructor(options) {
        // Set options
        this.time = options.time
        this.assets = options.assets
        this.physic = options.physic
        this.params = options.params

        this.container = new Object3D()

        this.terrainShader
    
        // this.setPhysic()
        this.setWorld()
        this.updateShader()
    }

    setWorld() {
        this.world = this.assets.models.World.scene
        // this.world.ReceivedShadow = true
        this.world.scale.set(0.25, 0.25, 0.25)
        this.world.position.set(0,-5,0)

        this.world.children[4].material.onBeforeCompile = shader => {
            shader.vertexShader = shader.vertexShader.replace(
              `#include <fog_pars_vertex>`,
              fogParsVert
            )
            shader.vertexShader = shader.vertexShader.replace(
              `#include <fog_vertex>`,
              fogVert
            )
            shader.fragmentShader = shader.fragmentShader.replace(
              `#include <fog_pars_fragment>`,
              fogParsFrag
            )
            shader.fragmentShader = shader.fragmentShader.replace(
              `#include <fog_fragment>`,
              fogFrag
            )
        
            const uniforms = ({
              fogNearColor: { value: new Color(this.params.fogNearColor) },
              fogNoiseFreq: { value: this.params.fogNoiseFreq },
              fogNoiseSpeed: { value: this.params.fogNoiseSpeed },
              fogNoiseImpact: { value: this.params.fogNoiseImpact },
              time: { value: 0 }
            });
        
            shader.uniforms = UniformsUtils.merge([shader.uniforms, uniforms])
            this.terrainShader = shader
        }

        this.container.add(this.world)
    }

    updateShader() {
        this.time.on('tick', ()=>{
            if(this.terrainShader) {
                this.terrainShader.uniforms.time.value += 0.1
              }
        })
    }
}