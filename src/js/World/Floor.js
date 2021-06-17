import {
  Object3D,
  MeshLambertMaterial,
  Vector2,
  Color,
  ShaderMaterial,
  DoubleSide,
  FrontSide
} from 'three'

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

const material = new ShaderMaterial({
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


export default class Floor {
  constructor(options) {
    // Set options
    this.assets = options.assets
    this.time = options.time
    this.debug = options.debug

    // Set up
    this.container = new Object3D()
    this.container.name = "map"

    this.setFloor()
    this.animateWater()
    if(this.debug) {
      this.setDebug()
    }
  }

  animateWater() {
    this.time.on('tick', ()=> {

        material.uniforms.uTime.value = this.time.elapsed
    })
  }

  setFloor() {
    // this.assets.textures.water.repeat.set(10, 10);
    // this.assets.textures.water.wrapS = RepeatWrapping;
    // this.assets.textures.water.wrapT = RepeatWrapping;

    this.texture = new MeshLambertMaterial({ map: this.assets.textures.water })

    this.floor = this.assets.models.MAP_NOT_CONVERTED3.scene
    this.floor.traverse((child) => {
      if (child.name.includes('Cone') || child.name.includes('Cylinder') || child.name.includes('Cube')) {
        child.castShadow = true
        if (child.material.name.includes('LEAVES') || child.material.name.includes('Leaf') || child.material.name.includes('rock') || child.material.name.includes('WOOD')) {
          child.material.transparent = true
        }
      }
      if (child.name.includes('ARBUSTE')) {
        child.castShadow = true
        if (child.material.name.includes('PLANT')) {
          child.material.transparent = true
        }
      }
      if (child.name.includes('HOUSE') || child.name.includes('ROCK')) {
        child.castShadow = true
      }
      if (child.name.includes('SOL')) {
        child.receiveShadow = true
      }
      if (child.name.includes('ARMOIR')) {
        child.castShadow = true
      }
      if (child.name.includes('CLOUD')) {
        child.castShadow = true
      }
      if (child.name.includes('ROCHER_MASSIF')) {
        child.castShadow = true
        child.receiveShadow = true
        child.material.side = FrontSide
      }
      if(child.name.includes('EAU')) {
        child.material = this.texture
        child.material = material
      }
      if(child.name.includes('mod_') || child.name.includes('modInt_')) {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        } else {
          child.traverse((children) => {
            if (children.isMesh) {
              children.castShadow = true
              children.receiveShadow = true
            }
          })
        }
      }
    })
    // this.floor.scale.set(0.2, 0.2, 0.2)
    this.container.add(this.floor)
  }

  setDebug() {
    if (this.debug) {
      this.debugFolder = this.debug.addFolder('Water')
      this.debugFolder
          .add(material.uniforms.uBigWavesElevation, 'value')
          .name('elevation of the water')
          .min(-10)
          .max(10)
          .step(0.1)
      this.debugFolder
          .add(material.uniforms.uHeightWave, 'value')
          .name('height of waves')
          .min(0)
          .max(10)
          .step(0.001)
      this.debugFolder
          .add(material.uniforms.uBigWavesSpeed, 'value')
          .name('speed of the water')
          .min(0)
          .max(0.001)
          .step(0.000001)
      this.debugFolder
          .add(material.uniforms.uBigWavesFrequency.value, 'x')
          .name('X frequency of the water')
          .min(-10)
          .max(10)
          .step(0.1)
      this.debugFolder
          .add(material.uniforms.uBigWavesFrequency.value, 'y')
          .name('Y frequency of the water')
          .min(-10)
          .max(10)
          .step(0.1)
      this.debugFolder
          .addColor(debugObject, 'depthColor')
          .name('Depth Color')
          .onChange(() => {
              material.uniforms.uDepthColor.value.set(debugObject.depthColor)
            })
      this.debugFolder
          .addColor(debugObject, 'surfaceColor')
          .name('Surface Color')
          .onChange(() => {
              material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
            })
      this.debugFolder
          .add(material.uniforms.uColorOffset, 'value')
          .name('color offset')
          .min(0)
          .max(2)
          .step(0.001)
      this.debugFolder
          .add(material.uniforms.uColorMultiplier, 'value')
          .name('color multiplier')
          .min(0)
          .max(10)
          .step(0.01)
    }
        
  }
}
