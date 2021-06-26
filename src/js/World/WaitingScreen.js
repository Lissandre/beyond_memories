import { AudioListener, AxesHelper, Object3D } from 'three'
import { Octree } from 'three/examples/jsm/math/Octree'

import AmbientLightSource from './Lights/AmbientLight'
import HemisphereLightSource from './Lights/HemisphereLight'
import Floor from './Floor'
import Perso from './Perso/Perso'
import Skybox from './Sky/Sky'
import BoxObjectManager from './BoxObject/BoxObjectManager'
import CanvasResult from './CanvasResult/CanvasResult'
import Seagull from './Seagull/Seagull'
import Butterfly from './Butterfly/Butterfly'
import Particles from './Particles/Particles'

import Data from '../../data/data.json'


export default class WaitingScreen {
  constructor(options) {
    // Set options
    this.time = options.time
    this.debug = options.debug
    this.assets = options.assets
    this.camera = options.camera
    this.scene = options.scene
    this.itemsIventory = options.itemsInventory
    this.body = options.body
    this.screenShot = options.screenShot
    this.appThis = options.appThis
    this.renderer = options.renderer
    this.composer = options.composer
    this.initButton = options.initButton
    this.music = options.music

    this.qualityButton = options.qualityButton
    this.qualityDiv = options.qualityDiv

    this.openOptions = options.openOptions
    this.closeOptions = options.closeOptions

    this.musicRange = options.musicRange
    this.ambianceRange = options.ambianceRange
    this.js_musicVol = options.js_musicVol
    this.js_ambianceVol = options.js_ambianceVol
    this.muteButton = options.muteButton
    this.unmuteButton = options.unmuteButton

    this.outline = options.outline

    // Set up
    this.container = new Object3D()
    this.worldOctree = new Octree()
    this.container.name = 'Waiting screen'

    this.playerInventory = []
    this.elementEnteredArray = []
    this.curves = [
      [
        [47.69215774536133, 103.88478088378906, 9.540440559387207] ,
        [-127.65484619140625, 88.41449737548828, 11.899239540100098] ,
        [-87.81683349609375, -54.887062072753906, 24.988933563232422] ,
        [23.712326049804688, -27.731792449951172, 21.446821212768555] ,
        [47.69215774536133, 103.88478088378906, 9.540440559387207] ,
      ]
    ]

    this.musicFinVol = 1

    if (this.debug) {
      this.container.add(new AxesHelper(5))
      this.debugFolder = this.debug.addFolder('WaitingScreen')
      this.debugFolder.open()
    }

  }
  init() {
    this.setAmbientLight()
    this.setSky()
    this.setHemisphereLight()
    this.setAudioListener()
    this.setFloor()

    this.setSeagull()
    this.setSeagull2()
    this.setSeagull3()
    this.setSeagull4()
    this.setSeagull5()
    this.setSeagull6()
    this.setButterfly()
    this.setButterfly2()
    this.setParticules()
    
    this.getMusicRangeValue()
    this.muteSoundMethod()
    this.unmuteSoundMethod()
  }
  
  setAmbientLight() {
    this.ambientlight = new AmbientLightSource({
    })
    this.container.add(this.ambientlight.container)
  }
  setHemisphereLight() {
    this.light = new HemisphereLightSource({
    })
    this.container.add(this.light.container)
  }
  setFloor() {
    this.floor = new Floor({
      assets: this.assets,
      time: this.time,
      scene: this.scene,
      listener: this.listener,
      ambianceRange: this.ambianceRange,
      js_ambianceVol: this.js_ambianceVol,
      ambianceFinVol: 0
    })
    this.container.add(this.floor.container)
    this.worldOctree.fromGraphNode(this.assets.models.PHYSICS.scene)
  }
  
  setSky() {
    this.sky = new Skybox({
      time: this.time,
      renderer: this.renderer,
      composer: this.composer,
      sphereTopColor: 0x0096ff,
      sphereBottomColor: 0xa2dcfc,
      offset: 20,
      exponent: 2
    })
    this.container.add(this.sky.container)
  }

  setSeagull() {
    this.seagull = new Seagull({
      time: this.time,
      assets: this.assets,
      curve: this.curves[0],
      decal: -60,
      heightDecal: 20,
      lineVisible: false,
      rotation: Math.PI,
      speed: 0.001
    })
    this.container.add(this.seagull.container)
  }

  setSeagull2() {
    this.seagull2 = new Seagull({
      time: this.time,
      assets: this.assets,
      curve: [
        [47.69215774536133, 103.88478088378906, 9.540440559387207] ,
        [-127.65484619140625, 88.41449737548828, 11.899239540100098] ,
        [-87.81683349609375, -54.887062072753906, 24.988933563232422] ,
        [23.712326049804688, -27.731792449951172, 21.446821212768555] ,
        [47.69215774536133, 103.88478088378906, 9.540440559387207] ,
      ],
      decal: -57,
      heightDecal: 22,
      lineVisible: false,
      rotation: Math.PI,
      speed: 0.00104
    })
    this.container.add(this.seagull2.container)
  }

  setSeagull3() {
    this.seagull3 = new Seagull({
      time: this.time,
      assets: this.assets,
      curve: [
        [47.69215774536133, 103.88478088378906, 9.540440559387207] ,
        [-127.65484619140625, 88.41449737548828, 11.899239540100098] ,
        [-87.81683349609375, -54.887062072753906, 24.988933563232422] ,
        [23.712326049804688, -27.731792449951172, 21.446821212768555] ,
        [47.69215774536133, 103.88478088378906, 9.540440559387207] ,
      ],
      decal: -63,
      heightDecal: 18,
      lineVisible: false,
      rotation: Math.PI,
      speed: 0.00102
    })
    this.container.add(this.seagull3.container)
  }

  setSeagull4() {
    this.seagull4 = new Seagull({
      time: this.time,
      assets: this.assets,
      curve: [
        [47.69215774536133, 103.88478088378906, 9.540440559387207] ,
        [-127.65484619140625, 88.41449737548828, 11.899239540100098] ,
        [-87.81683349609375, -54.887062072753906, 24.988933563232422] ,
        [23.712326049804688, -27.731792449951172, 21.446821212768555] ,
        [47.69215774536133, 103.88478088378906, 9.540440559387207] ,
      ].reverse(),
      decal: -55,
      heightDecal: 24,
      lineVisible: false,
      rotation: Math.PI,
      speed: 0.001
    })
    this.container.add(this.seagull4.container)
  }

  setSeagull5() {
    this.seagull5 = new Seagull({
      time: this.time,
      assets: this.assets,
      curve: [
        [47.69215774536133, 103.88478088378906, 9.540440559387207] ,
        [-127.65484619140625, 88.41449737548828, 11.899239540100098] ,
        [-87.81683349609375, -54.887062072753906, 24.988933563232422] ,
        [23.712326049804688, -27.731792449951172, 21.446821212768555] ,
        [47.69215774536133, 103.88478088378906, 9.540440559387207] ,
      ].reverse(),
      decal: -52,
      heightDecal: 26,
      lineVisible: false,
      rotation: Math.PI,
      speed: 0.00104
    })
    this.container.add(this.seagull5.container)
  }

  setSeagull6() {
    this.seagull6 = new Seagull({
      time: this.time,
      assets: this.assets,
      curve: [
        [47.69215774536133, 103.88478088378906, 9.540440559387207] ,
        [-127.65484619140625, 88.41449737548828, 11.899239540100098] ,
        [-87.81683349609375, -54.887062072753906, 24.988933563232422] ,
        [23.712326049804688, -27.731792449951172, 21.446821212768555] ,
        [47.69215774536133, 103.88478088378906, 9.540440559387207] ,
      ].reverse(),
      decal: -58,
      heightDecal: 22,
      lineVisible: false,
      rotation: Math.PI,
      speed: 0.00102
    })
    this.container.add(this.seagull6.container)
  }

  setButterfly() {
    this.butterfly = new Butterfly({
      time: this.time,
      assets: this.assets,
      curve: [
        [0.22757530212402344, -2.221489429473877, 5],
        [0.22757530212402344, -2.221489429473877, 5],
        [-1.8654354810714722, -4.528411388397217, 5],
        [-4.785167694091797, -7.040308952331543, 5],
        [-7.4153642654418945, -7.535991191864014, 5],
        [-9.737287521362305, -7.310304164886475, 5],
        [-11.392159461975098, -6.660364627838135, 5],
        [-12.330945014953613, -5.16754150390625, 5],
        [-12.177045822143555, -2.9667816162109375, 5],
        [-10.638052940368652, 0.6344614028930664, 5],
        [-7.59529972076416, 4.540771961212158, 5],
        [-3.8008956909179688, 5.488203525543213, 5],
        [-0.7774209976196289, 4.188275337219238, 5],
        [1.0232001543045044, 1.0641200542449951, 5],
        [12.1620547771453857, -0.0138654708862305, 5],
        [5.2728655338287354, -11.17099666595459, 5],
        [-8.22275161743164, -11.026939392089844, 5],
        [-7.304580211639404, -2.692131757736206, 5],
        [-13.927192687988281, -0.6309871673583984, 5],
        [-13.942583084106445, 6.00206995010376, 5.2705764770507812],
        [-5.803896903991699, 9.718185424804688, 5.0827462673187256],
        [1.8961199522018433, 6.00206995010376, 5],
        [2.0, 0.0, -0.18960541486740112],
      ]
    })
    this.container.add(this.butterfly.container)
  }

  setButterfly2() {
    this.butterfly2 = new Butterfly({
      time: this.time,
      assets: this.assets,
      curve: [
        [0.22757530212402344, -2.221489429473877, 5],
        [0.22757530212402344, -2.221489429473877, 5],
        [-1.8654354810714722, -4.528411388397217, 5],
        [-4.785167694091797, -7.040308952331543, 5],
        [-7.4153642654418945, -7.535991191864014, 5],
        [-9.737287521362305, -7.310304164886475, 5],
        [-11.392159461975098, -6.660364627838135, 5],
        [-12.330945014953613, -5.16754150390625, 5],
        [-12.177045822143555, -2.9667816162109375, 5],
        [-10.638052940368652, 0.6344614028930664, 5],
        [-7.59529972076416, 4.540771961212158, 5],
        [-3.8008956909179688, 5.488203525543213, 5],
        [-0.7774209976196289, 4.188275337219238, 5],
        [1.0232001543045044, 1.0641200542449951, 5],
        [12.1620547771453857, -0.0138654708862305, 5],
        [5.2728655338287354, -11.17099666595459, 5],
        [-8.22275161743164, -11.026939392089844, 5],
        [-7.304580211639404, -2.692131757736206, 5],
        [-13.927192687988281, -0.6309871673583984, 5],
        [-13.942583084106445, 6.00206995010376, 5.2705764770507812],
        [-5.803896903991699, 9.718185424804688, 5.0827462673187256],
        [1.8961199522018433, 6.00206995010376, 5],
        [2.0, 0.0, -0.18960541486740112],
      ].reverse()
    })
    this.container.add(this.butterfly2.container)
  }

  setAudioListener() {
    this.listener = new AudioListener()
    this.camera.camera.add(this.listener)
  }

  setParticules() {
    this.particules = new Particles({
      time: this.time,
      assets: this.assets
    })
    this.container.add(this.particules.container)
  }

  getMusicRangeValue() {
    this.musicRange.addEventListener('input', ()=> {
      this.musicFinVol = this.musicRange.value / 100
      
      this.music.volume = this.musicFinVol
      this.js_musicVol.innerHTML = this.musicRange.value
    })
  }

  muteSoundMethod() {
    this.muteButton.addEventListener('click', ()=> {
      this.oldMusicValue = this.musicFinVol
      this.oldAmbianceValue = this.floor.ambianceFinVol
      this.music.volume = 0
      this.floor.oceanSound.setVolume(0)
      this.floor.riverSound.setVolume(0)
      this.musicRange.disabled = true
      this.ambianceRange.disabled = true
      this.muteButton.style.display = 'none'
      this.unmuteButton.style.display = 'block'
      
    })
  }

  unmuteSoundMethod() {
    this.unmuteButton.addEventListener('click', ()=> {
        this.music.volume = this.oldMusicValue
        this.floor.oceanSound.setVolume(this.oldAmbianceValue)
        this.floor.riverSound.setVolume(this.oldAmbianceValue)
        this.musicRange.disabled = false
        this.ambianceRange.disabled = false
        this.muteButton.style.display = 'block'
        this.unmuteButton.style.display = 'none'
    })
  }

  openOptionsMethod() {
    this.optionButton.addEventListener('click', () => {
      this.body.classList.add('open_options')
      if(this.body.classList.contains('open_inventory')) {
        this.body.classList.remove('open_inventory')
      }
    })
  }

  closeOptionsMethod() {
    this.replayCta = document.querySelector('.js_replayCta')

    this.closeOptionButton.addEventListener('click', () => {
      this.body.classList.remove('open_options')
    })

    this.replayCta.addEventListener('click', () => {
      this.body.classList.remove('open_options')
    })

  }

}
