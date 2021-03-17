import { Color, Fog, Scene, sRGBEncoding, WebGLRenderer, FogExp2, PCFSoftShadowMap } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js';
import * as dat from 'dat.gui'
import Stats from 'stats.js'

import Sizes from '@tools/Sizes'
import Time from '@tools/Time'
import Assets from '@tools/Loader'

import Camera from './Camera'
import World from '@world/index'

export default class App {
  constructor(options) {
    // Set options
    this.canvas = options.canvas

    // Set up
    this.time = new Time()
    this.sizes = new Sizes()
    this.assets = new Assets()
    this.params = {
      fogColor: 0xdb81a8,
      fogNearColor: 0xfc4848,
      fogHorizonColor: 0xe4dcff,
      fogDensity: 0.02,
      fogNoiseSpeed: 50,
      fogNoiseFreq: .0012,
      fogNoiseImpact: 1
    }

    this.setConfig()
    this.setRenderer()
    this.setCamera()
    this.setWorld()
    // this.setAmbientOcclusion()
  }
  setRenderer() {
    // Set scene
    this.scene = new Scene()
    // Set fog
    // this.scene.fog = new FogExp2(this.params.fogColor, this.params.fogDensity)
    // Set renderer
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    this.renderer.outputEncoding = sRGBEncoding
    this.renderer.gammaFactor = 2.2
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFSoftShadowMap
    // Set background color
    this.renderer.setClearColor(0xfafafa, 1)
    // Set renderer pixel ratio & sizes
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
    // Resize renderer on resize event
    this.sizes.on('resize', () => {
      this.renderer.setSize(
        this.sizes.viewport.width,
        this.sizes.viewport.height
      )
    })
    // Set RequestAnimationFrame with 60fps
    this.time.on('tick', () => {
      this.debug && this.stats.begin()
      // if (!(this.renderOnBlur?.activated && !document.hasFocus() ) ) {
      this.renderer.render(this.scene, this.camera.camera)
      // }
      this.debug && this.stats.end()
    })

    if (this.debug) {
      this.renderOnBlur = { activated: true }
      const folder = this.debug.addFolder('Renderer')
      folder.add(this.renderOnBlur, 'activated').name('Render on window blur')
      // folder
      //   .add(this.scene.fog, 'density')
      //   .name('Fog density')
      //   .min(0)
      //   .max(1)
      //   .step(0.01)
      folder
        .addColor(this.params, 'fogColor')
        .name('Fog Color')
        .onChange(() => {
          this.scene.fog.color = new Color(this.params.fogColor)
        })
    }
  }
  setCamera() {
    // Create camera instance
    this.camera = new Camera({
      sizes: this.sizes,
      renderer: this.renderer,
      debug: this.debug,
    })
    // Add camera to scene
    this.scene.add(this.camera.container)
  }
  setWorld() {
    // Create world instance
    this.world = new World({
      time: this.time,
      debug: this.debug,
      assets: this.assets,
      camera: this.camera,
      scene: this.scene,
      params: this.params
    })
    // Add world to scene
    this.scene.add(this.world.container)
  }
  setConfig() {
    if (window.location.hash === '#debug') {
      this.debug = new dat.GUI({ width: 450 })
      this.stats = new Stats()
      this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(this.stats.dom)
    }
  }
  setAmbientOcclusion() {
    this.composer = new EffectComposer( this.renderer );
    this.renderPass = new RenderPass( this.scene, this.camera.camera );
    this.saoPass = new SAOPass( this.scene, this.camera.camera, false, true );
    this.saoPass.params.saoBias = 0.5
    this.saoPass.params.saoIntensity = 0.0015
    this.saoPass.params.saoScale = 3
    this.saoPass.params.saoKernelRadius = 10
    this.saoPass.params.saoMinResolution = 0
    this.saoPass.params.saoBlur = false
    this.saoPass.params.saoBlurRadius = 8
    this.saoPass.params.saoBlurStdDev = 4
    this.saoPass.params.saoBlurDepthCutoff = 0.01
    
    this.composer.addPass( this.renderPass );
    this.composer.addPass( this.saoPass );

    this.time.on('tick', ()=> {
      this.debug && this.stats.begin()
      this.composer.render()
      this.debug && this.stats.end()
    })
  }
}
