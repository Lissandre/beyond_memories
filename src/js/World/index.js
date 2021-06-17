import { AxesHelper, Object3D } from 'three'
import { Octree } from 'three/examples/jsm/math/Octree'

import AmbientLightSource from './Lights/AmbientLight'
import HemisphereLightSource from './Lights/HemisphereLight'
import Floor from './Floor'
import Perso from './Perso/Perso'
import Skybox from './Sky/Sky'
import Water from './Water/Water'
import BoxObjectManager from './BoxObject/BoxObjectManager'

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

    // Set up
    this.container = new Object3D()
    this.worldOctree = new Octree()
    this.container.name = 'World'

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
    this.setFloor()
    // this.setWater()
    this.setPerso()
    this.setBoxObjectManager()
    this.PlayerEnterObjectArea()
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
  setFloor() {
    this.floor = new Floor({
      assets: this.assets,
      time: this.time,
      debug: this.debug
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
      sphereTopColor: 0xaaddff,
      sphereBottomColor: 0xbbeeff,
      offset: 20,
      exponent: 2,
    })
    this.container.add(this.sky.container)
  }

  setWater() {
    this.water = new Water({
      time: this.time,
      debug: this.debug
    })
    this.container.add(this.water.container)
  }

  setBoxObjectManager() {
    this.boxObjectManager = new BoxObjectManager({
      time: this.time,
      debug: this.debug,
      assets: this.assets
    })
    this.container.add(this.boxObjectManager.container)
  }




  openDiagOne() {
    document.addEventListener(
      'keydown',
      this.handleKeyE.bind(this),
      false
    )
    // console.log('open diag oui');
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
      if(this.elementEntered !== null) {
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
    // console.log(this.appThis.watchCar);
  }

  collecteObject() {
    if(this.elementEntered.isCollected === false) {
      if(this.playerInventory.length < 8) {
       
        this.elementEntered.isCollected = true
        this.playerInventory.push(Data.monde_1[this.elementEntered.child.name])
        console.log(this.playerInventory)
        this.createItemCrad()
      }else {
        console.log('trop d\'item mon pote')
      }
    }
      
  }

    // if(this.videoScreen.isCollected === false){
    //   if(this.playerInventory.length < 8) {
    //     this.videoScreen.isCollected = true
    //     this.videoScreen.videoLoad.pause()
    //     this.playerInventory.push(this.videoScreen.data)
    //     console.log(this.playerInventory)
    //     this.videoScreen.container.visible = false
    //     this.createItemCrad()
    //   }else {
    //     console.log('there is too much items in your inventory');
    //   }
    // }
  // }

  createItemCrad() {
    
    let item = document.createElement("div")
    item.classList.add('inventory_content_items_item')

    let item_imageContainer = document.createElement("div")
    item_imageContainer.classList.add("item_pic")
    let item_image = document.createElement("img")
    item_image.setAttribute("src", Data.monde_1[this.elementEntered.child.name].links.image)
    item_imageContainer.appendChild(item_image)

    let item_textContainer = document.createElement("div")
    item_textContainer.classList.add('item_texts')
    let item_name = document.createElement("p")
    item_name.textContent = Data.monde_1[this.elementEntered.child.name].name
    let item_description = document.createElement("p")
    item_description.textContent = Data.monde_1[this.elementEntered.child.name].description
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
    if(this.elementEntered.isCollected === true) {
      this.elementEntered.isCollected = false
      let positionInInventory = this.playerInventory.indexOf(Data.monde_1[this.elementEntered.id])
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












  PlayerEnterObjectArea() {
    
    this.time.on('tick', ()=> {
      if(this.perso.moveForward || this.perso.moveBackward || this.perso.moveLeft || this.perso.moveRight) {

        this.boxObjectManager.boxesArr.forEach(element => {
          
          this.playerenteredInObject = element.objectBB.intersectsBox(this.perso.playerBB)
          
          if(this.playerenteredInObject === true) {
            // console.log('enter in object');
            this.elementEntered = element
            this.openDiagOne()
            // console.log(Data.monde_1[element.child.name]);
          }else{
          }

          if(this.playerenteredInObject !== true && this.elementEntered === element) {
            this.elementEntered = null
          }
        });
        

      }
    })
    
  }

}
