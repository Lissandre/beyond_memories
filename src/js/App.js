import { Color, Fog, Scene, sRGBEncoding, WebGLRenderer, Vector2, PCFSoftShadowMap, CineonToneMapping } from 'three'

// Post Pro
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
// import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
// import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
// import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
// import VignetteShader from '@shaders/Vignette/Vignette.js'

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

    this.openInventory = options.openInventory
    this.closeInventory = options.closeInventory
    this.openOptions = options.openOptions
    this.closeOptions = options.closeOptions
    this.body = options.body
    this.itemsInventory = options.itemsInventory
    this.screenShot = options.screenShot
    this.initButton = options.initButton
    this.music = options.music

    this.musicRange = options.musicRange
    this.ambianceRange = options.ambianceRange
    this.js_musicVol = options.js_musicVol
    this.js_ambianceVol = options.js_ambianceVol
    this.muteButton = options.muteButton
    this.unmuteButton = options.unmuteButton

    // Set up
    this.time = new Time()
    this.sizes = new Sizes()
    this.assets = new Assets()
    this.params = {
      fogColor: 0xf3faff,
      fogNear: 0,
      fogFar: 248
    }


    this.composer 

    this.setConfig()
    this.setRenderer()
    this.setCamera()
    this.composerCreator()
    this.setWorld()
    this.openInventoryMethod()
    this.closeInventoryMethod()
    this.openOptionsMethod()
    this.closeOptionsMethod()
  }
  setRenderer() {
    // Set scene
    this.scene = new Scene()
    // Set fog
    this.scene.fog = new Fog(this.params.fogColor, this.params.fogNear, this.params.fogFar)
    // Set renderer
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    // this.renderer.toneMapping = CineonToneMapping
    // this.renderer.toneMappingExposure = 2
    this.renderer.outputEncoding = sRGBEncoding
    this.renderer.gammaFactor = 2.2
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMapSoft = true
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
        // }
        
        if(this.composer) {
          this.composer.render(this.time.delta * 0.0001)
        }else {
          this.renderer.render(this.scene, this.camera.camera)
        }

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
      folder
        .add(this.params, 'fogNear')
        .name('Fog Near')
        .min(0.0)
        .max(500)
        .step(1)
        .onChange(()=> {
          this.scene.fog.near = this.params.fogNear
        })
      folder
        .add(this.params, 'fogFar')
        .name('Fog Far')
        .min(0.0)
        .max(500)
        .step(1)
        .onChange(()=> {
          this.scene.fog.far = this.params.fogFar
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
      itemsInventory: this.itemsInventory,
      screenShot: this.screenShot,
      appThis: this,
      body: this.body,
      renderer: this.renderer,
      composer: this.composer,
      initButton: this.initButton,
      music: this.music,
      musicRange: this.musicRange,
      ambianceRange: this.ambianceRange,
      js_musicVol: this.js_musicVol,
      js_ambianceVol: this.js_ambianceVol,
      muteButton: this.muteButton,
      unmuteButton: this.unmuteButton
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

  openInventoryMethod() {
    this.openInventory.addEventListener('click', () => {
      this.body.classList.add('open_inventory')
    })
  }

  closeInventoryMethod() {
    this.closeInventory.addEventListener('click', () => {
      this.body.classList.remove('open_inventory')
    })
  }

  openOptionsMethod() {
    this.openOptions.addEventListener('click', () => {
      this.body.classList.add('open_options')
      if(this.body.classList.contains('open_inventory')) {
        this.body.classList.remove('open_inventory')
      }
    })
  }

  closeOptionsMethod() {
    this.closeOptions.addEventListener('click', () => {
      this.body.classList.remove('open_options')
    })
  }


  composerCreator() {
    
    //Composer
    this.composer = new EffectComposer( this.renderer );
    this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.composer.setSize(window.innerWidth * 2, window.innerHeight * 2)

    // Render
    this.renderPass = new RenderPass(this.scene, this.camera.camera)
    this.composer.addPass(this.renderPass)
    
    // Grain (film pass)
    this.filmPass = new FilmPass(0.15,0,0,false)
    this.filmPass.renderToScreen = true
    // this.composer.addPass(this.filmPass)

    const params = {
      exposure: 0,
      bloomStrength: 0.12,
      bloomThreshold: 0,
      bloomRadius: 0
    }
    const bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 )
    bloomPass.threshold = params.bloomThreshold
    bloomPass.strength = params.bloomStrength
    bloomPass.radius = params.bloomRadius
    this.composer.addPass( bloomPass )

    // this.bokehPass = new BokehPass(this.scene, this.camera.camera, {
    //   focus: 20.0,
    //   aperture: 0.00002,
    //   maxblur: 0.004,
    //   width: this.sizes.viewport.width,
    //   height: this.sizes.viewport.height,
    // })
    // this.composer.addPass(this.bokehPass)

    //Vignette
    // this.shaderVignette = new VignetteShader
	  // this.effectVignette = new ShaderPass( this.shaderVignette )
    // console.log(this.effectVignette);
	  // this.effectVignette.renderToScreen = true;
    // this.effectVignette.uniforms[ "offset" ].value = 0.8;
	  // this.effectVignette.uniforms[ "darkness" ].value = 1.6;
    // this.composer.addPass(this.effectVignette)

  }
}
