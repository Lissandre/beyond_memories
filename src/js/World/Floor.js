import {
  Object3D,
  UniformsUtils,
  Color
} from 'three'
import { fogParsVert, fogVert, fogParsFrag, fogFrag } from '@shaders/FogReplace'

export default class Floor {
  constructor(options) {
    // Set options
    this.assets = options.assets
    this.fogParams = options.fogParams
    this.time = options.time
    this.debug = options.debug

    // Set up
    this.container = new Object3D()

    this.terrainShader

    this.setFloor()
    this.updateShader()

  }
  setFloor() {
    this.floor = this.assets.models.MAP_RESIZED.scene
    this.floor.traverse((child) => {
      if (child.name.includes('Cone')) {
        child.castShadow = true
        if (child.material.name === 'LEAVES') {
          child.material.transparent = true
        }
      }
      if (child.name.includes('SOL')) {
        child.receiveShadow = true
      }
    })

    this.floor.children[4].material.onBeforeCompile = shader => {
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
        fogNearColor: { value: new Color(this.fogParams.fogNearColor) },
        fogNoiseFreq: { value: this.fogParams.fogNoiseFreq },
        fogNoiseSpeed: { value: this.fogParams.fogNoiseSpeed },
        fogNoiseImpact: { value: this.fogParams.fogNoiseImpact },
        time: { value: 0 }
      });
  
      shader.uniforms = UniformsUtils.merge([shader.uniforms, uniforms])
      this.terrainShader = shader
  }

    // this.floor.scale.set(0.2, 0.2, 0.2)
    this.container.add(this.floor)
  }

  updateShader() {
    this.time.on('tick', ()=>{
        if(this.terrainShader) {
            this.terrainShader.uniforms.time.value += 0.1
          }
    })
}
}
