import { Color, Fog, Scene, sRGBEncoding, WebGLRenderer, Vector2, PCFSoftShadowMap, CineonToneMapping, Vector3, LinearEncoding } from 'three'

// Post Pro
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

import { Timeline } from 'gsap';


import * as dat from 'dat.gui'
import Stats from 'stats.js'

import Sizes from '@tools/Sizes'
import Time from '@tools/Time'
import Assets from '@tools/Loader'

import Camera from './Camera'
import World from '@world/index'
import WaitingScreen from '@world/WaitingScreen';
import IntroCam from './introCam';

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
    this.js_startAll = options.js_startAll
    this.js_waitingOptions = options.js_waitingOptions
    this.music = options.music
    this.musicWaiting = options.musicWaiting

    this.qualityButton = options.qualityButton
    this.qualityDiv = options.qualityDiv

    this.homeDiv = options.homeDiv
    this.introVideo = options.introVideo
    this.introVideoContainer = options.introVideoContainer

    this.musicRange = options.musicRange
    this.ambianceRange = options.ambianceRange
    this.js_musicVol = options.js_musicVol
    this.js_ambianceVol = options.js_ambianceVol
    this.muteButton = options.muteButton
    this.unmuteButton = options.unmuteButton

    this.openOptions = options.openOptions
    this.closeOptions = options.closeOptions

    // this.gTimeline = new gsap.timeline()

    // Set up
    this.time = new Time()
    this.sizes = new Sizes()
    this.assets = new Assets()
    this.params = {
      fogColor: 0xa2dcfc,
      fogNear: 0,
      fogFar: 248
    }

    this.isWaitingScreen = true
    this.musicWaitingFinVol = 1

    this.composer 

    this.setConfig()
    this.setRenderer()
    this.setCamera()
    this.setIntroCam()
    this.composerCreator()
    this.setWorld()
    this.setWaitingScreen()
    this.checkInventoryLength()
    this.openInventoryMethod()
    this.closeInventoryMethod()
    this.selectDefinition()
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
    this.renderer.sortObjects = false
    // Set background color
    this.renderer.setClearColor(0xfafafa, 1)
    // Set renderer pixel ratio & sizes
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
    this.renderer.info.autoReset = false
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
        if(this.isWaitingScreen === true) {
          if(this.composer) {
            this.renderer.info.reset()
            this.composer.render(this.time.delta * 0.0001)
          }else {
            this.renderer.render(this.scene, this.introCam.camera)
          }
        }else if(this.isWaitingScreen === false){
          if(this.composer) {
            this.renderer.info.reset()
            this.composer.render(this.time.delta * 0.0001)
          }else {
            this.renderer.render(this.scene, this.camera.camera)
          }
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

  setIntroCam() {
    // Create camera instance
    this.introCam = new IntroCam({
      sizes: this.sizes,
      renderer: this.renderer,
      debug: this.debug,
      time: this.time,
      homeDiv: this.homeDiv
    })
    // Add camera to scene
    this.scene.add(this.introCam.container)
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
      unmuteButton: this.unmuteButton,
      outline: this.outlinePass,
      openOptions: this.openOptions,
      closeOptions: this.closeOptions,
      qualityButton: this.qualityButton,
      qualityDiv: this.qualityDiv
    })
    // Add world to scene
    this.scene.add(this.world.container)
  }

  setWaitingScreen() {
    // Create world instance
    this.waitingScreen = new WaitingScreen({
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
      unmuteButton: this.unmuteButton,
      outline: this.outlinePass,
      openOptions: this.openOptions,
      closeOptions: this.closeOptions,
      qualityButton: this.qualityButton,
      qualityDiv: this.qualityDiv
    })
    // Add world to scene
    this.scene.add(this.waitingScreen.container)
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

  checkInventoryLength() {
    this.invLength = this.world.playerInventory.length
    this.depthColorFor3 = new Color(0x0a3772)
    this.surfaceColorFor3 = new Color(0x43b1d9)
    if(this.invLength >= 3) {
      this.world.floor.materialOcean.uniforms.uHeightWave.value = 4
      this.world.floor.materialOcean.uniforms.uDepthColor.value = this.depthColorFor3
      this.world.floor.materialOcean.uniforms.uSurfaceColor.value = this.surfaceColorFor3
      console.log(this.world.floor.materialOcean.uniforms)
    }
    console.log(this.world.playerInventory.length);
  }

  selectDefinition () {
    this.qualityButton.forEach(element => {
      element.addEventListener('click', ()=> {
        this.choosenDefinition = element.dataset.definition
        console.log(this.choosenDefinition);
        this.waitingScreen.init()
        this.qualityDiv.style.opacity = 0

        this.musicWaiting.play()
        this.musicWaiting.volume = this.musicWaitingFinVol

        this.js_startAll.addEventListener('click', ()=> {
          
          this.musicWaiting.pause()
          this.homeDiv.style.opacity = 0
          
          this.introVideoContainer.style.opacity = 1
          this.introVideo.addEventListener('ended', ()=> {
            console.log('fin de video');
            this.introVideoContainer.style.opacity = 0
            this.world.music.play()
            this.world.music.volume = this.world.musicFinVol
            this.world.init()
            setTimeout(() => {
              this.introVideoContainer.remove()
            }, 2000)
          })
          
          this.isWaitingScreen = false
          this.renderPass.camera = this.camera.camera
          this.scene.remove(this.waitingScreen.container)
          this.scene.remove(this.introCam.container)
          
          setTimeout(() => {
            this.homeDiv.remove()
            this.introVideo.play()
          }, 2000)
        })

        this.js_waitingOptions.addEventListener('click',()=> {
          this.body.classList.add('open_options')
          if(this.body.classList.contains('open_inventory')) {
            this.body.classList.remove('open_inventory')
          }
        })
        this.world.createUi()
        this.world.closeOptionsMethod()

        setTimeout(() => {
          this.qualityDiv.remove()
        }, 4000)
      })
    });
  }

  composerCreator() {
    
    //Composer
    this.composer = new EffectComposer( this.renderer );
    
    // this.composer.outputEncoding = sRGBEncoding
    this.composer.renderer.outputEncoding = sRGBEncoding
    // this.composer.renderer.gammaFactor = 2
    this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
    this.composer.setSize(window.innerWidth, window.innerHeight)

    // Render
    this.renderPass = new RenderPass(this.scene, this.introCam.camera)
    this.composer.addPass(this.renderPass)
    
    // Grain (film pass)
    this.filmPass = new FilmPass(0.5,0,0,false)
    
    this.filmPass.renderToScreen = true
    // this.composer.addPass(this.filmPass)

    const params = {
      exposure: 0,
      bloomStrength: 0.12,
      bloomThreshold: 0,
      bloomRadius: 0
    }
    const bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 1 )
    bloomPass.threshold = params.bloomThreshold
    bloomPass.strength = params.bloomStrength
    bloomPass.radius = params.bloomRadius

    

    // this.bokehPass = new BokehPass(this.scene, this.camera.camera, {
    //   focus: 20.0,
    //   aperture: 0.00002,
    //   maxblur: 0.004,
    //   width: this.sizes.viewport.width,
    //   height: this.sizes.viewport.height,
    // })
    // this.composer.addPass(this.bokehPass)

    

    // Tint pass
    const TintShader = {
      uniforms: {
        tDiffuse: { value: null },
        uTint: { value: null }
      },
      vertexShader:`
        varying vec2 vUv;

        void main()
        {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

          vUv = uv;
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec3 uTint;
        varying vec2 vUv;

        void main()
        {
          vec4 color = texture2D(tDiffuse, vUv);
          color.rgb += uTint;
  
          gl_FragColor = color;
        }
      `
    }

    this.tintPass = new ShaderPass( TintShader)
    this.tintPass.material.uniforms.uTint.value = new Vector3() 
    

    // LUT
    this.shaderPassGammaCorr = new ShaderPass( GammaCorrectionShader )
    
    //Vignette
    
    const VignetteShader = {
      
      uniforms: {
        
        "tDiffuse": { type: "t", value: null },
        "offset":   { type: "f", value: 1.0 },
        "darkness": { type: "f", value: 1.0 }
        
      },
      
      vertexShader: `
      varying vec2 vUv;
      
      void main() {
        
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        
      }`,
      
      
      
      fragmentShader: `
      uniform float offset;
      uniform float darkness;
      
      uniform sampler2D tDiffuse;
      
      varying vec2 vUv;
      
      void main() {
        
        // Eskil's vignette
        
        // vec4 texel = texture2D( tDiffuse, vUv );
        // vec2 uv = ( vUv - vec2( 0.5 ) ) * vec2( offset );
        // gl_FragColor = vec4( mix( texel.rgb, vec3( 1.0 - darkness ), dot( uv, uv ) ), texel.a );
        
        
        // alternative version from glfx.js
        // this one makes more dusty look (as opposed to burned)
        
        vec4 color = texture2D( tDiffuse, vUv );
        float dist = distance( vUv, vec2( 0.5 ) );
        color.rgb *= smoothstep( 0.8, offset * 0.799, dist *( darkness + offset ) );
        gl_FragColor = color;
        
       
      }
      `
      
      
      
    };
    
    this.shaderVignette = VignetteShader
	  this.effectVignette = new ShaderPass( this.shaderVignette )
	  this.effectVignette.renderToScreen = true;
    this.effectVignette.uniforms[ "offset" ].value = 0.15;
	  this.effectVignette.uniforms[ "darkness" ].value = 0.8 ;

    this.outlinePass = new OutlinePass( new Vector2( this.sizes.width, this.sizes.height ), this.scene, this.camera.camera )
    this.outlinePass.edgeThickness = 1.5
    this.outlinePass.edgeStrength = 5
    this.outlinePass.visibleEdgeColor = new Color(0xffffff)
    this.outlinePass.hiddenEdgeColor = new Color(0xffffff)
    // this.outlinePass.pulsePeriod = 2

    this.fxaaPass = new ShaderPass( FXAAShader )
    const pixelRatio = this.renderer.getPixelRatio()

    this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( this.sizes.width * pixelRatio );
    this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( this.sizes.height * pixelRatio );

    this.composer.addPass( this.tintPass)
    
    // this.composer.addPass( this.tintPass)
    this.composer.addPass(this.effectVignette)
    // this.composer.addPass(this.filmPass)
    this.composer.addPass( bloomPass )
    this.composer.addPass( this.outlinePass )
    this.composer.addPass( this.fxaaPass )
    this.composer.addPass( this.shaderPassGammaCorr )
    
    
    
    if (this.debug) {
      const folder = this.debug.addFolder('Teinte')
      folder
        .add(this.tintPass.material.uniforms.uTint.value, 'x')
        .name('Rouge')
        .min(-1.0)
        .max(1.0)
        .step(0.0001)
      folder
        .add(this.tintPass.material.uniforms.uTint.value, 'y')
        .name('Vert')
        .min(-1.0)
        .max(1.0)
        .step(0.0001)
      folder
        .add(this.tintPass.material.uniforms.uTint.value, 'z')
        .name('Bleu')
        .min(-1.0)
        .max(1.0)
        .step(0.0001)
      const folderVign = this.debug.addFolder('Vignette')
      folderVign
          .add(this.effectVignette.uniforms["offset"], 'value')
          .name('Offset')
          .min(0.0)
          .max(3.0)
          .step(0.0001)
        folderVign
          .add(this.effectVignette.uniforms["darkness"], 'value')
          .name('Darkness')
          .min(-1.0)
          .max(1.0)
          .step(0.0001)
      const folderGrain = this.debug.addFolder('Grain')
          folderGrain
            .add(this.filmPass.material.uniforms.nIntensity, 'value')
            .name('Quantité')
            .min(0.0)
            .max(3.0)
            .step(0.0001)
          folderGrain
            .add(this.filmPass.material.uniforms.sCount, 'value')
            .name('Lignes')
            .min(0.0)
            .max(2000.0)
            .step(1.0)
          folderGrain
            .add(this.filmPass.material.uniforms.sIntensity, 'value')
            .name('Intensitée')
            .min(0.0)
            .max(3.0)
            .step(0.0001)
      const folderBloom = this.debug.addFolder('Bloom')
          folderBloom
            .add(params, 'bloomThreshold')
            .name('Threshold')
            .min(0.0)
            .max(3.0)
            .step(0.0001)
          folderBloom
            .add(params, 'bloomStrength')
            .name('Strength')
            .min(0.0)
            .max(2000.0)
            .step(1.0)
          folderBloom
            .add(params, 'bloomRadius')
            .name('Radius')
            .min(0.0)
            .max(3.0)
            .step(0.0001)
    }

  }
}
