import { AxesHelper, Object3D } from 'three'
import { Octree } from 'three/examples/jsm/math/Octree'

import AmbientLightSource from './Lights/AmbientLight'
import HemisphereLightSource from './Lights/HemisphereLight'
import Floor from './Floor'
import Perso from './Perso/Perso'
import Skybox from './Sky/Sky'
import Water from './Water/Water'

export default class World {
  constructor(options) {
    // Set options
    this.time = options.time
    this.debug = options.debug
    this.assets = options.assets
    this.camera = options.camera
    this.scene = options.scene

    // Set up
    this.container = new Object3D()
    this.worldOctree = new Octree()
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
    this.setHemisphereLight()
    this.setFloor()
    // this.setWater()
    this.setPerso()
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
}
