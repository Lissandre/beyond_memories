import { AxesHelper, Box3, Object3D } from 'three'
import { Octree } from 'three/examples/jsm/math/Octree'

import Camera from '../Camera'

import AmbientLightSource from './Lights/AmbientLight'
import HemisphereLightSource from './Lights/HemisphereLight'
import Physic from './Physic/Physic'
import Floor from './Floor'
import Perso from './Perso/Perso'
import Skybox from './Sky/Sky'
import Elmo from './Elmo/Elmo'
import VideoScreen from './VideoScreen/VideoScreen'
import CanvasResult from './CanvasResult/CanvasResult'
import RCcar from './RCcar/RCcar'


export default class World {
  constructor(options) {
    // Set options
    this.time = options.time
    this.debug = options.debug
    this.assets = options.assets
    this.camera = options.camera
    this.scene = options.scene
    this.text_01 = options.text_01
    this.text_02 = options.text_02
    this.video = options.video
    this.sizes = options.sizes
    this.renderer = options.renderer
    this.hasVideoScreen = options.hasVideoScreen
    this.watchCar = options.watchCar
    this.appThis = options.appThis
    this.itemsIventory = options.itemsInventory
    this.screenShot = options.screenShot
    this.body = options.body

    
    // Set up
    this.container = new Object3D()
    this.worldOctree = new Octree()
    this.container.name = 'World'
    
    this.startText = false
    this.playerInventory = []

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
    this.setCameraForVideo()
    this.setPhysic()
    this.setFloor()
    this.setVideo()
    this.setCameraForCar()
    this.setCar()
    this.setPerso()
    this.setElmo()
    this.screenCanvas()
    this.PlayerEnterPNJArea()
    this.PlayerEnterCarArea()
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
        this.init()
        this.loadDiv.style.opacity = 0
        setTimeout(() => {
          this.loadDiv.remove()
        }, 550)
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
  setPhysic() {
    this.physic = new Physic({
      time: this.time,
      debug: this.debug,
      scene: this.scene,
    })
  }
  setFloor() {
    this.floor = new Floor({
      assets: this.assets,
    })
    this.container.add(this.floor.container)
    this.worldOctree.fromGraphNode(this.scene)
  }
  setPerso() {
    this.perso = new Perso({
      time: this.time,
      assets: this.assets,
      camera: this.camera,
      cameraVideoScreen: this.cameraVideo,
      cameraCar: this.cameraCar,
      hasVideoScreen: this.hasVideoScreen,
      watchCar: this.watchCar,
      physic: this.physic,
      debug: this.debug,
      appThis: this.appThis
    })
    this.container.add(this.perso.container)
  }
  setSky() {
    this.sky = new Skybox({
      time: this.time,
      debug: this.debug,
      sphereTopColor: 0x330d75,
      sphereBottomColor: 0xcfc5b9,
      offset: 20,
      exponent: 2,
    })
    this.container.add(this.sky.container)
  }

  setElmo() {
    this.elmo = new Elmo({
      time: this.time,
      assets: this.assets
    })
    this.container.add(this.elmo.container)
  }

  setCar() {
    this.car = new RCcar({
      time: this.time,
      assets: this.assets,
      cameraCar: this.cameraCar,
      worldOctree: this.worldOctree,
      watchCar: this.watchCar,
      appThis: this.appThis
    })
    this.container.add(this.car.container)
    console.log(this.car);
  }

  setVideo() {
    this.videoScreen = new VideoScreen({
      time: this.time,
      video: this.video
    })
  }

  setCameraForVideo() {
    this.cameraVideo = new Camera({
      sizes: this.sizes,
      renderer: this.renderer,
      debug: this.debug
    })
    this.cameraVideo.container.position.set(0,0.1,-12 )
    this.scene.add(this.cameraVideo.container)
  }

  setCameraForCar() {
    this.cameraCar = new Camera({
      sizes: this.sizes,
      renderer: this.renderer,
      debug: this.debug
    })
    this.cameraCar.container.position.set(5,2,-10 )
    this.scene.add(this.cameraCar.container)
  }

  screenCanvas() {
    this.screenShot.addEventListener('click', ()=> {
      this.CanvasResult = new CanvasResult({
        playerInventory: this.playerInventory,
        body: this.body
      })
    })
  }


  openDiagOne() {
    document.addEventListener(
      'keydown',
      this.handleKeyE.bind(this),
      false
    )
    document.addEventListener(
      'keydown',
      this.handleKeyF.bind(this),
      false
    )
  }

  handleKeyE(event) {
    // if(!this.playerEnteredInElmo ) {
    //   return
    // }
    switch (event.code) {
      case 'KeyE': // e
        this.text_01.style.opacity = 0
        if(this.playerEnteredInElmo) {
          if(this.appThis.hasVideoScreen === false && this.videoScreen.isCollected === false) {
            this.interactWithElmo()
          }
        }
        if(this.playerEnteredInCar) {
          console.log(this.appThis.watchCar);
          if(this.appThis.watchCar === false) {
            this.interactWithCar()
          }
        }
        break
    }
  }

  handleKeyF(event) {
    if(!this.playerEnteredInElmo) {
      return
    }
    switch (event.code) {
      case 'KeyF': // f
        this.text_01.style.opacity = 0
        if(this.playerEnteredInElmo) {
          if(this.videoScreen.isCollected === false){
            this.collecteObject()
          }else {
            return
          }
        }
        break
    }
  }

  interactWithElmo() {
    this.text_01.style.opacity = 0
    this.container.add(this.videoScreen.container)
    this.videoScreen.videoLoad.play()
  }

  interactWithCar() {
    this.text_01.style.opacity = 0
    this.appThis.watchCar = true
    console.log(this.appThis.watchCar);
  }

  collecteObject() {
    this.text_01.style.opacity = 0
    if(this.videoScreen.isCollected === false){
      if(this.playerInventory.length <= 10) {
        this.videoScreen.isCollected = true
        this.videoScreen.videoLoad.pause()
        this.playerInventory.push(this.videoScreen.data)
        console.log(this.playerInventory)
        this.videoScreen.container.visible = false
        this.createItemCrad()
      }else {
        console.log('there is too much items in your inventory');
      }
    }
  }

  createItemCrad() {
    
    let item = document.createElement("div")
    item.classList.add('inventory_content_items_item')

    let item_imageContainer = document.createElement("div")
    item_imageContainer.classList.add("item_pic")
    let item_image = document.createElement("img")
    item_image.setAttribute("src", this.videoScreen.data.links.image)
    item_imageContainer.appendChild(item_image)

    let item_textContainer = document.createElement("div")
    item_textContainer.classList.add('item_texts')
    let item_name = document.createElement("p")
    item_name.textContent = this.videoScreen.data.name
    let item_description = document.createElement("p")
    item_description.textContent = this.videoScreen.data.description
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
    buttonDelete.appendChild(spanL)
    buttonDelete.appendChild(spanR)
    buttonDelete.addEventListener("click", this.deleteItemCard.bind(this))

    
    item.appendChild(buttonDelete)
    item.appendChild(item_imageContainer)
    item.appendChild(item_textContainer)
    this.itemsIventory.appendChild(item)
  }

  deleteItemCard(event) {
    event.target.parentNode.parentNode.removeChild(event.target.parentNode)
    if(this.videoScreen.isCollected === true) {
      this.videoScreen.container.visible = true
      this.videoScreen.isCollected = false
      let positionInInventory = this.playerInventory.indexOf(this.videoScreen.data.id)
      this.playerInventory.splice(positionInInventory, 1)
      console.log(this.playerInventory);
    }
    
  }

  closeDiag() {
    document.removeEventListener(
      'keydown',
      this.handleKeyE, 
      false
    )
    document.removeEventListener(
      'keydown',
      this.handleKeyF, 
      false
    )
  }

  PlayerEnterPNJArea() {
    this.elmoBB = new Box3().setFromObject(this.elmo.container)
    

    this.openDiagOne()

    this.time.on('tick', ()=> {
      if(this.perso.moveForward || this.perso.moveBackward || this.perso.moveLeft || this.perso.moveRight) {

        this.playerEnteredInElmo = this.elmoBB.intersectsBox(this.perso.playerBB)

        if(this.playerEnteredInElmo === true) {
          this.text_01.style.opacity = 1
        }else{
          this.text_01.style.opacity = 0
          if(this.videoScreen) {
            this.container.remove(this.videoScreen.container)
            this.videoScreen.videoLoad.pause()
          }
        }

      }
    })
    
  }

  PlayerEnterCarArea() {
    this.carBB = new Box3().setFromObject(this.car.container)
    

    this.openDiagOne()

    this.time.on('tick', ()=> {
      if(this.perso.moveForward || this.perso.moveBackward || this.perso.moveLeft || this.perso.moveRight) {

        this.playerEnteredInCar = this.carBB.intersectsBox(this.perso.playerBB)

        if(this.playerEnteredInCar === true) {
          this.text_01.style.opacity = 1
        }else{
          this.text_01.style.opacity = 0
        }

      }
    })
    
  }
}
