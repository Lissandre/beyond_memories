import {
  Object3D,
  Vector2,
  Color,
  ShaderMaterial,
  DoubleSide,
  FrontSide,
  PositionalAudio,
  AudioLoader,
} from 'three'

import OceanFrag from '@shaders/Water/OceanFrag.frag'
import RiverFrag from '@shaders/Water/RiverFrag.frag'
import WaterVert from '@shaders/Water/WaterVert.vert'

import riverSound from '@sounds/river/river.mp3'
import oceanSound from '@sounds/ocean/ocean.mp3'

export default class Floor {
  constructor(options) {
    // Set options
    this.assets = options.assets
    this.time = options.time
    this.debug = options.debug
    this.scene = options.scene
    this.listener = options.listener

    this.ambianceRange = options.ambianceRange
    this.js_ambianceVol = options.js_ambianceVol

    this.ambianceFinVol = 1

    // Set up
    this.container = new Object3D()
    this.container.name = 'map'

    this.setFloor()
    this.animateWater()
    this.getAmbianceRangeValue()
    if (this.debug) {
      this.setDebug()
    }
  }

  animateWater() {
    this.time.on('tick', () => {
      this.materialRiver.uniforms.uTime.value = this.time.elapsed
      this.materialOcean.uniforms.uTime.value = this.time.elapsed
    })
  }

  getAmbianceRangeValue() {
    this.ambianceRange.addEventListener('input', () => {
      this.ambianceFinVol = this.ambianceRange.value / 50

      this.riverSound.setVolume(this.ambianceFinVol)
      this.oceanSound.setVolume(this.ambianceFinVol)
      this.js_ambianceVol.innerHTML = this.ambianceRange.value
      this
    })
  }

  setFloor() {
    this.riverSound = new PositionalAudio(this.listener)
    const audioLoaderR = new AudioLoader()
    audioLoaderR.load(riverSound, (buffer) => {
      this.riverSound.setBuffer(buffer)
      this.riverSound.setRefDistance(5)
      this.riverSound.setLoop(true)
      this.riverSound.setVolume(1)
      this.riverSound.play()
    })

    this.oceanSound = new PositionalAudio(this.listener)
    const audioLoaderO = new AudioLoader()
    audioLoaderO.load(oceanSound, (buffer) => {
      this.oceanSound.setBuffer(buffer)
      this.oceanSound.setRefDistance(5)
      this.oceanSound.setLoop(true)
      this.oceanSound.setVolume(1)
      this.oceanSound.play()
    })

    this.debugObject = {}
    this.debugObject.depthColor = '#0096ff'
    this.debugObject.surfaceColor = '#a2dcfc'

    const paramsOcean = {
      uBigWavesElevation: 0.5,
      uBigWavesFrequency: new Vector2(-1.6, 0.1),
      uTime: 0,
      uBigWavesSpeed: 0.001,
      uDepthColor: new Color(this.debugObject.depthColor),
      uSurfaceColor: new Color(this.debugObject.surfaceColor),
      uColorOffset: 0.25,
      uColorMultiplier: 1.13,
      uHeightWave: 1.2,
    }

    const paramsRiver = {
      uBigWavesElevation: -0.3,
      uBigWavesFrequency: new Vector2(-1.6, 0.1),
      uTime: 0,
      uBigWavesSpeed: 0.000108,
      uDepthColor: new Color(this.debugObject.depthColor),
      uSurfaceColor: new Color(this.debugObject.surfaceColor),
      uColorOffset: 0.25,
      uColorMultiplier: 1.13,
      uHeightWave: 1.201,
    }

    this.materialRiver = new ShaderMaterial({
      vertexShader: WaterVert,
      fragmentShader: RiverFrag,
      // side: DoubleSide,
      transparent: true,
      uniforms: {
        uBigWavesElevation: { value: paramsRiver.uBigWavesElevation },
        uBigWavesFrequency: { value: paramsRiver.uBigWavesFrequency },
        uBigWavesSpeed: { value: paramsRiver.uBigWavesSpeed },
        uHeightWave: { value: paramsRiver.uHeightWave },

        uTime: { value: paramsRiver.uTime },

        uDepthColor: { value: paramsRiver.uDepthColor },
        uSurfaceColor: { value: paramsRiver.uSurfaceColor },
        uColorOffset: { value: paramsRiver.uColorOffset },
        uColorMultiplier: { value: paramsRiver.uColorMultiplier },
      },
    })

    this.materialOcean = new ShaderMaterial({
      vertexShader: WaterVert,
      fragmentShader: OceanFrag,
      side: DoubleSide,
      uniforms: {
        uBigWavesElevation: { value: paramsOcean.uBigWavesElevation },
        uBigWavesFrequency: { value: paramsOcean.uBigWavesFrequency },
        uBigWavesSpeed: { value: paramsOcean.uBigWavesSpeed },
        uHeightWave: { value: paramsOcean.uHeightWave },

        uTime: { value: paramsOcean.uTime },

        uDepthColor: { value: paramsOcean.uDepthColor },
        uSurfaceColor: { value: paramsOcean.uSurfaceColor },
        uColorOffset: { value: paramsOcean.uColorOffset },
        uColorMultiplier: { value: paramsOcean.uColorMultiplier },

        fogColor: { type: 'c', value: this.scene.fog.color },
        fogNear: { type: 'f', value: this.scene.fog.near },
        fogFar: { type: 'f', value: this.scene.fog.far },
      },
      fog: true,
    })

    this.floor = this.assets.models.MAP.scene
    this.floor.traverse((child) => {
      if (
        child.isMesh &&
        !child.material.name.includes('LEAVES') &&
        !child.material.name.includes('Leaf') &&
        !child.material.name.includes('PLANT') &&
        !child.material.name.includes('BUSH') &&
        !child.name.includes('mod') &&
        !child.name.includes('HERBES')
      ) {
        child.material.side = FrontSide
      }
      if (
        child.name.includes('Cone') ||
        child.name.includes('Cylinder') ||
        child.name.includes('Cube')
      ) {
        child.castShadow = true
        child.receiveShadow = true
        if (child.material !== undefined) {
          if (
            child.material.name.includes('LEAVES') ||
            child.material.name.includes('Leaf') ||
            child.material.name.includes('rocks') ||
            child.material.name.includes('BUSH')
          ) {
            child.material.transparent = true
          }
        }
      }
      if (child.name.includes('ARBUSTE')) {
        child.castShadow = true
        child.receiveShadow = true
        if (child.material.name.includes('PLANT')) {
          child.material.transparent = true
        }
      }
      if (child.name.includes('HOUSE') || child.name.includes('ROCK')) {
        child.castShadow = true
        child.receiveShadow = true
      }
      if (child.name.includes('SOL')) {
        child.receiveShadow = true
      }
      if (child.name.includes('ARMOIR')) {
        child.castShadow = true
        child.receiveShadow = true
      }
      if (child.name.includes('CLOUD')) {
        child.receiveShadow = true
        child.castShadow = true
      }
      if (child.name.includes('ROCHER_MASSIF')) {
        child.castShadow = true
        child.receiveShadow = true
        child.material.side = FrontSide
      }
      if (child.name.includes('BARRIERE')) {
        child.castShadow = true
        child.receiveShadow = true
      }
      if (child.name.includes('HERBES')) {
        child.castShadow = true
        child.receiveShadow = true
      }
      if (child.name.includes('BUSH')) {
        child.castShadow = true
        child.receiveShadow = true
      }
      if (child.name.includes('EAU')) {
        child.material = this.materialRiver
        child.receiveShadow = true
        child.add(this.riverSound)
      }
      if (child.name.includes('Plane004')) {
        child.material = this.materialOcean
        child.receiveShadow = true
        child.add(this.oceanSound)
      }
      if (child.name.includes('mod_') || child.name.includes('modInt_')) {
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
      this.debugFolder = this.debug.addFolder('River')
      this.debugFolder
        .add(this.materialRiver.uniforms.uBigWavesElevation, 'value')
        .name('elevation of the water')
        .min(-10)
        .max(10)
        .step(0.1)
      this.debugFolder
        .add(this.materialRiver.uniforms.uHeightWave, 'value')
        .name('height of waves')
        .min(0)
        .max(10)
        .step(0.001)
      this.debugFolder
        .add(this.materialRiver.uniforms.uBigWavesSpeed, 'value')
        .name('speed of the water')
        .min(0)
        .max(0.001)
        .step(0.000001)
      this.debugFolder
        .add(this.materialRiver.uniforms.uBigWavesFrequency.value, 'x')
        .name('X frequency of the water')
        .min(-10)
        .max(10)
        .step(0.1)
      this.debugFolder
        .add(this.materialRiver.uniforms.uBigWavesFrequency.value, 'y')
        .name('Y frequency of the water')
        .min(-10)
        .max(10)
        .step(0.1)
      this.debugFolder
        .addColor(this.debugObject, 'depthColor')
        .name('Depth Color')
        .onChange(() => {
          this.materialRiver.uniforms.uDepthColor.value.set(
            this.debugObject.depthColor
          )
        })
      this.debugFolder
        .addColor(this.debugObject, 'surfaceColor')
        .name('Surface Color')
        .onChange(() => {
          this.materialRiver.uniforms.uSurfaceColor.value.set(
            this.debugObject.surfaceColor
          )
        })
      this.debugFolder
        .add(this.materialRiver.uniforms.uColorOffset, 'value')
        .name('color offset')
        .min(0)
        .max(2)
        .step(0.001)
      this.debugFolder
        .add(this.materialRiver.uniforms.uColorMultiplier, 'value')
        .name('color multiplier')
        .min(0)
        .max(10)
        .step(0.01)

      this.debugFolder = this.debug.addFolder('Ocean')
      this.debugFolder
        .add(this.materialOcean.uniforms.uBigWavesElevation, 'value')
        .name('elevation of the water')
        .min(-10)
        .max(10)
        .step(0.1)
      this.debugFolder
        .add(this.materialOcean.uniforms.uHeightWave, 'value')
        .name('height of waves')
        .min(0)
        .max(10)
        .step(0.001)
      this.debugFolder
        .add(this.materialOcean.uniforms.uBigWavesSpeed, 'value')
        .name('speed of the water')
        .min(0)
        .max(0.001)
        .step(0.000001)
      this.debugFolder
        .add(this.materialOcean.uniforms.uBigWavesFrequency.value, 'x')
        .name('X frequency of the water')
        .min(-10)
        .max(10)
        .step(0.1)
      this.debugFolder
        .add(this.materialOcean.uniforms.uBigWavesFrequency.value, 'y')
        .name('Y frequency of the water')
        .min(-10)
        .max(10)
        .step(0.1)
      this.debugFolder
        .addColor(this.debugObject, 'depthColor')
        .name('Depth Color')
        .onChange(() => {
          this.materialOcean.uniforms.uDepthColor.value.set(
            this.debugObject.depthColor
          )
        })
      this.debugFolder
        .addColor(this.debugObject, 'surfaceColor')
        .name('Surface Color')
        .onChange(() => {
          this.materialOcean.uniforms.uSurfaceColor.value.set(
            this.debugObject.surfaceColor
          )
        })
      this.debugFolder
        .add(this.materialOcean.uniforms.uColorOffset, 'value')
        .name('color offset')
        .min(0)
        .max(2)
        .step(0.001)
      this.debugFolder
        .add(this.materialOcean.uniforms.uColorMultiplier, 'value')
        .name('color multiplier')
        .min(0)
        .max(10)
        .step(0.01)
    }
  }
}
