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

export default class World {
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
    this.container.name = 'World'

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
      this.debugFolder = this.debug.addFolder('World')
      this.debugFolder.open()
    }

    this.setLoader()
  }
  init() {
    this.setAmbientLight()
    this.setSky()
    this.setHemisphereLight()
    this.setPerso()
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
    this.setBoxObjectManager()
    this.PlayerEnterObjectArea()
    this.screenCanvas()
    this.getMusicRangeValue()
    this.muteSoundMethod()
    this.unmuteSoundMethod()
  }
  setLoader() {
    this.loadDiv = document.querySelector('.loadScreen')
    this.loadModels = this.loadDiv.querySelector('.load')
    this.progress = this.loadDiv.querySelector('.progress')

    if (this.assets.total === 0) {
      this.init()
      this.loadDiv.remove()
    } else {
      this.assets.on('ressourceLoad', () => {
        this.progress.style.width = this.loadModels.innerHTML = `${
          Math.floor((this.assets.done / this.assets.total) * 100) +
          Math.floor((1 / this.assets.total) * this.assets.currentPercent)
        }%`
      })

      this.assets.on('ressourcesReady', () => {
        this.initButton.addEventListener('click', ()=> {
          this.init()
          this.music.play()
          this.music.volume = this.musicFinVol
          this.loadDiv.style.opacity = 0
          setTimeout(() => {
            this.loadDiv.remove()
          }, 550)
        })
      })
    }
  }
  setAmbientLight() {
    this.ambientlight = new AmbientLightSource({
      debug: this.debugFolder,
    })
    this.container.add(this.ambientlight.container)
  }
  setHemisphereLight() {
    this.light = new HemisphereLightSource({
      debug: this.debugFolder,
    })
    this.container.add(this.light.container)
  }
  setFloor() {
    this.floor = new Floor({
      assets: this.assets,
      time: this.time,
      debug: this.debug,
      scene: this.scene,
      listener: this.listener,
      ambianceRange: this.ambianceRange,
      js_ambianceVol: this.js_ambianceVol
    })
    this.container.add(this.floor.container)
    this.worldOctree.fromGraphNode(this.assets.models.PHYSICS.scene)
  }
  setPerso() {
    this.perso = new Perso({
      time: this.time,
      assets: this.assets,
      camera: this.camera,
      debug: this.debug,
      worldOctree: this.worldOctree,
    })
    this.container.add(this.perso.container)
  }
  setSky() {
    this.sky = new Skybox({
      time: this.time,
      debug: this.debug,
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

  setBoxObjectManager() {
    this.boxObjectManager = new BoxObjectManager({
      time: this.time,
      debug: this.debug,
      assets: this.assets,
    })
    this.container.add(this.boxObjectManager.container)
  }

  setParticules() {
    this.particules = new Particles({
      debug: this.debug,
      time: this.time
    })
    this.container.add(this.particules.container)
  }


  screenCanvas() {
    this.screenShot.addEventListener('click', ()=> {
      this.CanvasResult = new CanvasResult({
        playerInventory: this.playerInventory,
        body: this.body
      })
    })
  }

  getMusicRangeValue() {
    this.musicRange.addEventListener('input', ()=> {
      this.musicFinVol = this.musicRange.value / 100
      console.log(this.musicFinVol);
      this.music.volume = this.musicFinVol
      this.js_musicVol.innerHTML = this.musicRange.value
    })
  }

  muteSoundMethod() {
    this.muteButton.addEventListener('click', ()=> {
      this.oldMusicValue = this.musicFinVol
      this.oldAmbianceValue = this.floor.ambianceFinVol
      console.log(this.oldMusicValue, this.oldAmbianceValue);
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

  openDiagOne() {
    document.addEventListener(
      'keydown',
      this.handleKeyE.bind(this),
      false
    )
    // document.addEventListener(
    //   'keydown',
    //   this.handleKeyF.bind(this),
    //   false
    // )
  }

  handleKeyE(event) {
    // if(!this.playerEnteredInElmo ) {
    //   return
    // }
    switch (event.code) {
      case 'KeyE': // e
        if (this.elementEntered !== null) {
          this.collecteObject()
        }
        break
    }
  }

  // handleKeyF(event) {
  //   if(!this.playerenteredInObject) {
  //     return
  //   }
  //   switch (event.code) {
  //     case 'KeyF': // f
  //       this.text_01.style.opacity = 0
  //       if(this.playerenteredInObject) {
  //         if(this.videoScreen.isCollected === false){
  //           this.collecteObject()
  //         }else {
  //           return
  //         }
  //       }
  //       break
  //   }
  // }

  interactWithElmo() {
    this.text_01.style.opacity = 0
    this.container.add(this.videoScreen.container)
    this.videoScreen.videoLoad.play()
  }

  interactWithCar() {
    this.text_01.style.opacity = 0
    this.appThis.watchCar = true
  }

  collecteObject() {
    if (this.elementEntered.isCollected === false) {
      if (this.playerInventory.length < 8) {
        this.elementEntered.isCollected = true
        this.playerInventory.push(Data.monde_1[this.elementEntered.child.name])
        console.log(this.playerInventory)
        this.createItemCrad()
      } else {
        console.log("trop d'item mon pote")
      }
    }
  }


  createItemCrad() {
    let item = document.createElement('div')
    item.classList.add('inventory_content_items_item')

    let item_imageContainer = document.createElement('div')
    item_imageContainer.classList.add('item_pic')
    let item_image = document.createElement('img')
    item_image.setAttribute(
      'src',
      Data.monde_1[this.elementEntered.child.name].links.image
    )
    item_imageContainer.appendChild(item_image)

    let item_textContainer = document.createElement('div')
    item_textContainer.classList.add('item_texts')
    let item_name = document.createElement('p')
    item_name.textContent = Data.monde_1[this.elementEntered.child.name].name
    let item_description = document.createElement('p')
    item_description.textContent =
      Data.monde_1[this.elementEntered.child.name].description
    item_textContainer.appendChild(item_name)
    item_textContainer.appendChild(item_description)

    let buttonDelete = document.createElement("button")
    buttonDelete.classList.add("item_button")
    let spanL = document.createElement("span")
    let spanR = document.createElement("span")
    spanL.classList.add("button_bar")
    spanR.classList.add("button_bar")
    spanL.classList.add("leftBar")
    spanR.classList.add("rightBar")
    buttonDelete.dataset.dataJs = "js_deleteObject"
    buttonDelete.dataset.object = Data.monde_1[this.elementEntered.child.name].data_object
    buttonDelete.appendChild(spanL)
    buttonDelete.appendChild(spanR)
    buttonDelete.addEventListener('click', this.deleteItemCard.bind(this))

    item.appendChild(buttonDelete)
    item.appendChild(item_imageContainer)
    item.appendChild(item_textContainer)
    this.itemsIventory.appendChild(item)
  }

  deleteItemCard(event) {
      event.target.parentNode.parentNode.removeChild(event.target.parentNode)
      this.playerInventory = this.playerInventory.filter((element) => {
        
        return element.data_object !== event.target.dataset.object
      })
      this.boxObjectManager.boxesArr[event.target.dataset.object].isCollected = false
      console.log(this.playerInventory);
  }

  closeDiag() {
    document.removeEventListener('keydown', this.handleKeyE, false)
    document.removeEventListener('keydown', this.handleKeyF, false)
  }

  PlayerEnterObjectArea() {
    
    this.time.on('tick', ()=> {
      if(this.perso.moveForward || this.perso.moveBackward || this.perso.moveLeft || this.perso.moveRight) {
        
        // console.log(this.elementEnteredArray);

        for (const elementName in this.boxObjectManager.boxesArr) {
          const element = this.boxObjectManager.boxesArr[elementName];
          this.playerenteredInObject = element.objectBB.intersectsBox(this.perso.playerBB)
          
          if(this.playerenteredInObject === true) {
            this.elementEntered = element
            this.meshes = []
            this.elementEntered.child.traverse((child) => {
              if(child.isMesh) {
                this.meshes.push(child)
              }
            })
            this.outline.selectedObjects = this.meshes

            this.openDiagOne()
          }
          // else{
            // this.appThis.outlinePass.selectedObjects.pop()
          // }

          if (
            this.playerenteredInObject !== true &&
            this.elementEntered === element
          ) {
            this.elementEntered = null
            this.outline.selectedObjects = []
          }
        }
      }
    })
  }
}
