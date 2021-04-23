import { Color, Fog, Scene, sRGBEncoding, Vector3, WebGLRenderer } from 'three'
import * as dat from 'dat.gui'
import Stats from 'stats.js'

import Sizes from '@tools/Sizes'
import Time from '@tools/Time'
import Assets from '@tools/Loader'

import Camera from './Camera'
import World from '@world/index'

import data from '../data/object.json'

export default class App {
  constructor(options) {
    // Set options
    this.canvas = options.canvas
    this.text_01 = options.text_01
    this.text_02 = options.text_02
    this.video = options.video
    this.hasVideoScreen = false
    this.openInventory = options.openInventory
    this.closeInventory = options.closeInventory
    this.body = options.body

    // Set up
    this.time = new Time()
    this.sizes = new Sizes()
    this.assets = new Assets()
    this.params = {
      fogColor: 0xcfc5b0,
    }

    this.setConfig()
    this.setRenderer()
    this.init()
    this.setCamera()
    this.setWorld()
    this.openInventoryMethod()
    this.closeInventoryMethod()
  }

  init() {
    document.addEventListener('keydown', this.handleKeyEscape.bind(this), false)
  }
  setRenderer() {
    // Set scene
    this.scene = new Scene()
    // Set fog
    this.scene.fog = new Fog(this.params.fogColor, 1, 80)
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

    this.lookScreenPos = new Vector3(0,0.1,-12)
    
    // Set RequestAnimationFrame with 60fps
    this.time.on('tick', () => {
      this.debug && this.stats.begin()
      // if (!(this.renderOnBlur?.activated && !document.hasFocus() ) ) {

      // console.log(this.world.container);
      this.world.container.children.some((child)=>{
        if(child.name === data.monde_1[1].name) {
          this.hasVideoScreen = true
        } else {
          this.hasVideoScreen = false
        }
      })
      if(this.hasVideoScreen) {
        this.renderer.render(this.scene, this.world.cameraVideo.camera)
        this.world.cameraVideo.container.position.lerp(this.lookScreenPos, 0.1)
      }else {
          this.renderer.render(this.scene, this.camera.camera)
        
        // Redonne la possibilité de le remettre a true (re afficher la cam plan)
        // this.requestCameraNormal = false
      }

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
      text_01: this.text_01,
      text_02: this.text_02,
      video: this.video,
      sizes: this.sizes,
      renderer: this.renderer,
      hasVideoScreen: this.hasVideoScreen,
      appThis: this 
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

  handleKeyEscape(event) {
    switch (event.code) {
        case 'Escape': // e
          this.world.container.remove(this.world.videoScreen.container)
          this.world.videoScreen.videoLoad.pause()
          console.log('escape');
          break
      }
  }

  openInventoryMethod() {
    this.openInventory.addEventListener('click', ()=> {
      this.body.classList.add('open_inventory')
    })
  }

  closeInventoryMethod() {
    this.closeInventory.addEventListener('click', ()=> {
      this.body.classList.remove('open_inventory')
    })
  }
}
