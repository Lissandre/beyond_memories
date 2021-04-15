import { AxesHelper, Object3D, Box3 } from 'three'

import AmbientLightSource from './Lights/AmbientLight'
import HemisphereLightSource from './Lights/HemisphereLight'
import Physic from './Physic/Physic'
import Floor from './Floor'
import Perso from './Perso/Perso'
import Skybox from './Sky/Sky'
import Planet from './Planet/Planet'
import { Plane } from 'cannon-es'
import Butterfly from './Butterfly/Butterfly'
import Elmo from './Elmo/Elmo'

export default class World {
  constructor(options) {
    // Set options
    this.time = options.time
    this.debug = options.debug
    this.assets = options.assets
    this.camera = options.camera
    this.scene = options.scene
    this.params = options.params
    this.text_01 = options.text_01
    this.text_02 = options.text_02

    // Set up
    this.container = new Object3D()
    this.container.name = 'World'

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
    this.setHemisphereLig
    this.setPlanet()
    this.setPhysic()
    this.setFloor()
    this.setPerso()
    this.setButterfly()
    this.setElmo()
    this.PlayerEnterPNJArea()
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
      physic: this.physic,
      assets: this.assets,
    })
    this.container.add(this.floor.container)
  }
  setPerso() {
    this.perso = new Perso({
      time: this.time,
      assets: this.assets,
      camera: this.camera,
      physic: this.physic,
      debug: this.debug,
    })
    this.container.add(this.perso.container)
  }
  setSky() {
    this.sky = new Skybox({
      time: this.time,
      debug: this.debug,
      sphereTopColor: 0x330d75,
      sphereBottomColor: 0xdb81a8,
      offset: 20,
      exponent: 2,
    })
    this.container.add(this.sky.container)
  }

  setPlanet() {
    this.planet = new Planet({
      time: this.time,
      assets: this.assets,
      params: this.params
    })
    this.container.add(this.planet.container)
  setButterfly() {
    this.butterfly = new Butterfly({
      time: this.time,
      assets: this.assets
    })
    this.container.add(this.butterfly.container)
  }
  setElmo() {
    this.elmo = new Elmo({
      time: this.time,
      assets: this.assets
    })
    this.container.add(this.elmo.container)
  }
  openDiagOne() {
    document.addEventListener(
      'keydown',
      this.handleKeyE.bind(this),
      false
    )
  }

  handleKeyE(event) {
    if(!this.playerEnteredInElmo) {
      return
    }
    switch (event.code) {
      case 'KeyE': // e
        this.text_01.style.opacity = 0
        if(this.playerEnteredInElmo) {
          this.interactWithElmo()
        }
        break
    }
  }

  interactWithElmo() {
    this.text_02.style.opacity = 1
  }

  closeDiag() {
    document.removeEventListener(
      'keydown',
      this.handleKeyE, 
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
          this.text_02.style.opacity = 0
          
        }else{
          this.text_01.style.opacity = 0
          this.text_02.style.opacity = 0
        }

      }
    })
  }
}
