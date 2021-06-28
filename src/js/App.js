import {
  Color,
  Fog,
  Scene,
  sRGBEncoding,
  WebGLRenderer,
  Vector2,
  PCFSoftShadowMap,
  Vector3,
} from 'three'
import { getGPUTier } from 'detect-gpu'

// Post Pro
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'


import gsap from 'gsap'

import * as dat from 'dat.gui'
import Stats from 'stats.js'

import Sizes from '@tools/Sizes'
import Time from '@tools/Time'
import Assets from '@tools/Loader'

import Camera from './Camera'
import World from '@world/index'
import WaitingScreen from '@world/WaitingScreen'
import IntroCam from './introCam'

export default class App {
  constructor(options) {
    // Set options
    this.canvas = options.canvas

    this.openInventory = options.openInventory
    this.closeInventory = options.closeInventory
    this.inventoryItems = options.inventoryItems
    this.openOptions = options.openOptions
    this.closeOptions = options.closeOptions
    this.body = options.body
    this.itemsInventory = options.itemsInventory
    this.bubbleInventory = options.bubbleInventory
    this.screenShot = options.screenShot
    this.initButton = options.initButton
    this.js_startAll = options.js_startAll
    this.js_waitingOptions = options.js_waitingOptions
    this.music = options.music
    this.musicWaiting = options.musicWaiting
    this.musicObject = options.msuicObject

    this.qualityButton = options.qualityButton
    this.qualityDiv = options.qualityDiv
    this.qualityDivContainer = options.qualityDivContainer

    this.homeDiv = options.homeDiv
    this.blackHome = options.blackHome
    this.introVideo = options.introVideo
    this.introVideoContainer = options.introVideoContainer
    this.introVideoSkipContainer = options.introVideoSkipContainer
    this.introVideoSkipButton = options.introVideoSkipButton

    this.musicRange = options.musicRange
    this.ambianceRange = options.ambianceRange
    this.js_musicVol = options.js_musicVol
    this.js_ambianceVol = options.js_ambianceVol
    this.muteButton = options.muteButton
    this.unmuteButton = options.unmuteButton

    this.js_firstItemSound = options.js_firstItemSound
    this.js_getElmoSound = options.js_getElmoSound
    this.js_lastIemSound = options.js_lastIemSound

    this.openOptions = options.openOptions
    this.closeOptions = options.closeOptions
    this.bubbleOption = options.bubbleOption

    this.gTimeline = new gsap.timeline()

    this.endOfGame = false

    // Set up
    this.time = new Time()
    this.sizes = new Sizes()
    this.assets = new Assets()
    this.params = {
      fogColor: 0xa2dcfc,
      fogNear: 0,
      fogFar: 248,
    }

    this.isWaitingScreen = false
    this.musicWaitingFinVol = 1
    this.composer

    this.setLoader()
    this.setConfig()
    this.setRenderer()
    this.setCamera()
    this.setIntroCam()
    this.composerCreator()
    this.setWorld()
    this.setWaitingScreen()
    this.checkInventoryLength()
    this.selectDefinition()
  }
  setLoader() {
    this.loadDiv = document.querySelector('.loading')
    const tl = gsap.timeline()
    const path = document.querySelector('.loading-circle-background svg path')
    const l = path.getTotalLength()
    path.style.strokeDashoffset = 100
    if (this.assets.total === 0) {
      this.loadDiv.remove()
    } else {
      this.assets.on('ressourceLoad', () => {
        path.style.strokeDashoffset = -(l / 100) * (Math.floor((this.assets.done / this.assets.total) * 100) + Math.floor((1 / this.assets.total) * this.assets.currentPercent))

        tl
          .set(path, {strokeDasharray:l})
          .fromTo('.loading-title span', {y:'50%', autoAlpha:0}, {y:'0%', autoAlpha:1, duration:1.2, ease:'power4.out', stagger:{each: 0.07, ease:'power2.in'}}, 0.6)
          // .fromTo(path, {strokeDashoffset:l}, {strokeDashoffset: 0, duration:2, ease:'power4.out'}, '-=1.2')
      })

      this.assets.on('ressourcesReady', () => {
        this.timelineLoader = new gsap.timeline()
        this.timelineLoader
          .to(this.loadDiv, { duration: 1, opacity: 0, ease: 'power4.out' })
          .to(
            this.qualityDivContainer,
            { duration: 2, opacity: 1, ease: 'power4.out' },
            '+=0.5'
          )
        setTimeout(() => {
          this.loadDiv.remove()
        }, 550)
      })
    }
  }
  setRenderer() {
    // Set scene
    this.scene = new Scene()
    // Set fog
    this.scene.fog = new Fog(
      this.params.fogColor,
      this.params.fogNear,
      this.params.fogFar
    )
    // Set renderer
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      // antialias: true,
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
      if (this.isWaitingScreen === true) {
        if (this.composer) {
          this.renderer.info.reset()
          this.composer.render(this.time.delta * 0.0001)
        } else {
          this.renderer.render(this.scene, this.introCam.camera)
        }
      } else if (this.isWaitingScreen === false) {
        if (this.composer) {
          this.renderer.info.reset()
          this.composer.render(this.time.delta * 0.0001)
        } else {
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
        .onChange(() => {
          this.scene.fog.near = this.params.fogNear
        })
      folder
        .add(this.params, 'fogFar')
        .name('Fog Far')
        .min(0.0)
        .max(500)
        .step(1)
        .onChange(() => {
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
      blackHome: this.blackHome,
      gTimeline: this.gTimeline,
    })
    // Add camera to scene
    this.scene.add(this.introCam.container)
  }

  setWorld() {
    // Create world instance
    this.world = new World({
      perf: this.choosenDefinition,
      time: this.time,
      debug: this.debug,
      sizes: this.sizes,
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
      qualityDiv: this.qualityDiv,
      openInventory: this.openInventory,
      closeInventory: this.closeInventory,
      bubbleInventory: this.bubbleInventory,
      inventoryItems: this.inventoryItems,
      musicObject: this.musicObject,
      bubbleOption: this.bubbleOption,
      endOfGame: this.endOfGame,
      js_getElmoSound: this.js_getElmoSound
    })
    // Add world to scene
    this.scene.add(this.world.container)
  }

  setWaitingScreen() {
    // Create world instance
    this.waitingScreen = new WaitingScreen({
      perf: this.choosenDefinition,
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
      qualityDiv: this.qualityDiv,
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

  checkInventoryLength() {
    this.invLength = this.world.playerInventory.length
    this.depthColorFor3 = new Color(0x0a3772)
    this.surfaceColorFor3 = new Color(0x43b1d9)

    this.outroVideoContainer = document.querySelector('.outroContainer')
    this.outroVideo = document.querySelector('.videoOutro')

    if(this.invLength === 1) {
      this.js_firstItemSound.volume = 1
      this.js_firstItemSound.play()

      this.js_firstItemSound.addEventListener('ended', ()=> {
        this.js_firstItemSound.remove()
      })
    }
    if(this.invLength === 7) {
      this.js_lastIemSound.volume = 1
      this.js_lastIemSound.play()

      this.js_lastIemSound.addEventListener('ended', ()=> {
        this.js_lastIemSound.remove()
      })
    }
    if(this.invLength === 8) {
      setTimeout(()=> {
        console.log();
        this.optionButton = document.querySelector('.inventoryButton')
        this.closeOptionButton = document.querySelector('.options')
        this.thanksDiv = document.querySelector('.thanks')
        this.thanksTitle = document.querySelector('.thanks_title')
        this.thanksCreditsTitle = document.querySelector('.thanks_creditsTitle')
        this.thanksName = document.querySelectorAll('.thanks_name')
        this.thanksRefresh = document.querySelector('.thanks_refresh')

        this.gTimeline
          .to(this.outroVideoContainer, {duration: 1, opacity: 1, display: 'block', ease: 'power4.out'})
          .to(this.world.music, {duration: 1, volume: 0, ease: 'power4.out'})
          .to(this.openInventory, {duration: 1, opacity: 0, display: 'none', ease: 'power4.out'}, '-=1')
          .to(this.closeOptionButton, {duration: 1, opacity: 0, display: 'none', ease: 'power4.out'}, '-=1')
        
          
          this.world.screenCanvas()
          
          this.outroVideo.addEventListener('ended', ()=> {
            this.gTimeline
              .to(this.outroVideoContainer, {duration: 1, opacity: 0, display: 'none', ease: 'power4.out'})
              .to(this.musicWaiting, {duration: 1, volume: 1, ease: 'power4.out'})
            this.musicWaiting.volume = 0
            this.musicWaiting.play()

            this.scene.remove(this.world.container)
          })

          setTimeout(()=> {
            this.gTimeline
            .to(this.thanksDiv, {duration: 1, opacity: 1, display: 'flex', ease: 'power4.out'})
            .to(this.thanksTitle, {duration: 1, opacity: 1, ease: 'power4.out'})
            .to(this.thanksCreditsTitle, {duration: 1, opacity: 1, ease: 'power4.out'})
            .to(this.thanksName, {duration: 1, opacity: 1, ease: 'power4.out', stagger: 0.1})
            .to(this.thanksRefresh, {duration: 1, opacity:1, ease: 'power4.out'})
          }, 48500)
          
          setTimeout(()=> {
            this.outroVideo.play()
            this.world.music.pause()
            this.world.floor.oceanSound.pause()
            this.world.floor.riverSound.pause()
            this.waitingScreen.floor.oceanSound.pause()
            this.waitingScreen.floor.riverSound.pause()
          }, 1000)

          

      },2000)
    }
    if (this.choosenDefinition === 'high') {
      
      if (this.invLength === 2) {
        this.gTimeline
          .to(this.effectVignette.uniforms['darkness'], 1, {
            value: 0.7,
            ease: 'power4.out',
          })
          .to(this.effectVignette.uniforms['offset'], 1, {
            value: 0.15,
            ease: 'power4.out',
          }, '-=1')
          .to(this.world.floor.materialOcean.uniforms.uHeightWave, 1, {
            value: 2,
            ease: 'power4.out',
          }, '-=1')
      }

      if (this.invLength === 4) {
        this.gTimeline
          .to(this.effectVignette.uniforms['darkness'], 1, {
            value: 0.75,
            ease: 'power4.out',
          })
          .to(this.effectVignette.uniforms['offset'], 1, {
            value: 0.23,
            ease: 'power4.out',
          }, '-=1')
          .to(this.world.floor.materialOcean.uniforms.uHeightWave, 1, {
            value: 3.5,
            ease: 'power4.out',
          }, '-=1')
      }

      if (this.invLength === 6) {
        this.gTimeline
          .to(this.effectVignette.uniforms['darkness'], 1, {
            value: 0.77,
            ease: 'power4.out',
          })
          .to(this.effectVignette.uniforms['offset'], 1, {
            value: 0.31,
            ease: 'power4.out',
          }, '-=1')
          .to(this.world.floor.materialOcean.uniforms.uHeightWave, 1, {
            value: 5,
            ease: 'power4.out',
          }, '-=1')
          
      }
      
      if (this.invLength === 8) {
        this.gTimeline
          .to(this.effectVignette.uniforms['darkness'], 1, {
            value: 0.8,
            ease: 'power4.out',
          })
          .to(this.effectVignette.uniforms['offset'], 1, {
            value: 0.35,
            ease: 'power4.out',
          }, '-=1')
          .to(this.world.floor.materialOcean.uniforms.uHeightWave, 1, {
            value: 6.5,
            ease: 'power4.out',
          }, '-=1')
          

      }
    }
  }

  selectDefinition() {
    this.qualityButton.forEach((element) => {
      //  *****************
      // Choose definition
      // ******************
      getGPUTier().then((result) => {
        if (!document.querySelector('.recommended')) {
          const recoSpan = document.createElement('span')
          recoSpan.classList.add('recommended')
          recoSpan.innerHTML = '(Recommande pour vous)'
          document
            .querySelectorAll('.definition_item')
            [result.tier - 1].appendChild(recoSpan)
        }
      })
      element.addEventListener('click', () => {
        this.choosenDefinition = element.dataset.definition
        this.composerCreator()
        this.setWorld()
        this.setWaitingScreen()
        this.checkInventoryLength()

        if (this.choosenDefinition === 'low') {
          this.renderer.shadowMap.enabled = false
          this.renderer.antialias = false
        } else if (this.choosenDefinition === 'medium') {
          this.renderer.antialias = true
        }
        this.waitingScreen.init()
        this.musicWaiting.play()
        this.musicWaiting.volume = this.musicWaitingFinVol

        this.gTimeline
          .to(this.qualityDiv, { duration: 2, opacity: 0, ease: 'power4.out' })
          .to(this.homeDiv, {
            duration: 2,
            display: 'flex',
            opacity: 1,
            ease: 'power4.out',
          })
        // this.homeDiv.remove()
        // this.introVideoContainer.remove()

        // ***********************
        // Click on start button
        // ***********************
        this.js_startAll.addEventListener('click', () => {
          this.gTimeline
            .to(
              this.homeDiv,
              { duration: 1.6, opacity: 0, ease: 'power4.out' },
          )
            .to(this.musicWaiting, { duration: 1, volume: 0, ease: 'power4.out' }, '-=1')
            .to(this.introVideoContainer, {
              duration: 1,
              display: 'block',
              opacity: 1,
              ease: 'power4.out',
            }, '-=1')

          //***************
          // Click on skip
          // **************
          this.introVideoSkipButton.addEventListener('click', () => {
            setTimeout(() => {
              this.world.music.play()
              this.gTimeline.to(this.world.music, {
                duration: 0.5,
                volume: this.world.musicFinVol,
                ease: 'power4.out',
              })
              this.world.init()
            }, 550)
            setTimeout(() => {
              this.introVideo.pause()
              this.introVideo.currenTime = 0
              this.renderPass.camera = this.camera.camera
              this.gTimeline.to(this.introVideoContainer, {
                duration: 1,
                opacity: 0,
                ease: 'power4.out',
              })
              setTimeout(() => {
                this.introVideoContainer.remove()
              }, 1000)
            }, 1500)
            
          })

          // ************
          // Video ended
          // ************
          this.introVideo.addEventListener('ended', () => {

            setTimeout(() => {
              this.world.music.play()
              this.renderPass.camera = this.camera.camera
              this.gTimeline.to(this.world.music, {
                duration: 0.5,
                volume: this.world.musicFinVol,
                ease: 'power4.out',
              })
              this.introVideoContainer.remove()
              this.introVideo.remove()
              this.introVideo.style.display = 'none'
            this.world.init()
            }, 1000)
            this.gTimeline.to(this.introVideoContainer, {
              duration: 3,
              opacity: 0,
              ease: 'power4.out',
            })
          })

          setTimeout(() => {
            this.scene.remove(this.waitingScreen)
            this.homeDiv.remove()
            this.musicWaiting.pause()
            this.introVideo.play()
            this.introVideo.volume = 0
            this.gTimeline.to(this.introVideo, {
              duration: 0.5,
              volume: 1,
              ease: 'power4.out',
            })
            this.isWaitingScreen = false
            this.scene.remove(this.waitingScreen.container)
            this.scene.remove(this.introCam.container)
          }, 3500)
        })

        setTimeout(() => {
          this.qualityDiv.remove()
        }, 4000)
      })
    })
  }

  composerCreator() {
    //Composer
    this.composer = new EffectComposer(this.renderer)

    // this.composer.outputEncoding = sRGBEncoding
    this.composer.renderer.outputEncoding = sRGBEncoding
    // this.composer.renderer.gammaFactor = 2
    this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
    this.composer.setSize(window.innerWidth, window.innerHeight)

    this.outlinePass = new OutlinePass(
      new Vector2(this.sizes.width, this.sizes.height),
      this.scene,
      this.camera.camera
    )
    this.outlinePass.edgeThickness = 1.5
    this.outlinePass.edgeStrength = 5
    this.outlinePass.visibleEdgeColor = new Color(0xffffff)
    this.outlinePass.hiddenEdgeColor = new Color(0xffffff)
    // this.outlinePass.pulsePeriod = 2

    // Render
    this.renderPass = new RenderPass(this.scene, this.introCam.camera)
    this.composer.addPass(this.renderPass)
    this.composer.addPass(this.outlinePass)

    if (
      this.choosenDefinition === 'high' ||
      this.choosenDefinition === 'medium'
    ) {
      if (this.choosenDefinition === 'high') {
        const params = {
          exposure: 0,
          bloomStrength: 0.12,
          bloomThreshold: 0,
          bloomRadius: 0,
        }
        const bloomPass = new UnrealBloomPass(
          new Vector2(window.innerWidth, window.innerHeight),
          1.5,
          0.4,
          1
        )
        bloomPass.threshold = params.bloomThreshold
        bloomPass.strength = params.bloomStrength
        bloomPass.radius = params.bloomRadius

        this.fxaaPass = new ShaderPass(FXAAShader)
        const pixelRatio = this.renderer.getPixelRatio()

        this.fxaaPass.material.uniforms['resolution'].value.x =
          1 / (this.sizes.width * pixelRatio)
        this.fxaaPass.material.uniforms['resolution'].value.y =
          1 / (this.sizes.height * pixelRatio)

        

        this.composer.addPass(this.fxaaPass)
        this.composer.addPass(bloomPass)
      }

      const VignetteShader = {
        uniforms: {
          tDiffuse: { type: 't', value: null },
          offset: { type: 'f', value: 1.0 },
          darkness: { type: 'f', value: 1.0 },
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
          `,
      }

      this.shaderVignette = VignetteShader
      this.effectVignette = new ShaderPass(this.shaderVignette)
      this.effectVignette.renderToScreen = true
      this.effectVignette.uniforms['offset'].value = 0.15
      this.effectVignette.uniforms['darkness'].value = 0.8

      // Tint pass
      const TintShader = {
        uniforms: {
          tDiffuse: { value: null },
          uTint: { value: null },
        },
        vertexShader: `
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
        `,
      }

      this.tintPass = new ShaderPass(TintShader)
      this.tintPass.material.uniforms.uTint.value = new Vector3()

      // LUT
      this.shaderPassGammaCorr = new ShaderPass(GammaCorrectionShader)

      this.composer.addPass(this.tintPass)
      this.composer.addPass(this.effectVignette)
      // this.composer.addPass( this.tintPass)
      // this.composer.addPass(this.filmPass)
      this.composer.addPass(this.shaderPassGammaCorr)

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
        if (this.choosenDefinition === 'high') {
          const folderVign = this.debug.addFolder('Vignette')
          folderVign
            .add(this.effectVignette.uniforms['offset'], 'value')
            .name('Offset')
            .min(0.0)
            .max(2.0)
            .step(0.0001)
          folderVign
            .add(this.effectVignette.uniforms['darkness'], 'value')
            .name('Darkness')
            .min(-1.0)
            .max(10.0)
            .step(0.0001)
        }
      }
    }
  }
}
