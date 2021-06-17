import { Object3D } from 'three'
import BoxObjectVanilla from './BoxObjectVanilla'
import BoxObjectInteractif from './BoxObjectInteractif'

export default class BoxObjectManager {

    constructor(options) {
        
        //Set options
        this.time = options.time
        this.debug = options.debug
        this.assets = options.assets

        this.boxesArr = {}

        this.container = new Object3D()
        
        this.createBoxes()
    }
    
    createBoxes() {
        this.floor = this.assets.models.MAP.scene
        this.floor.traverse((child) => {
            if (child.name.includes('mod_')) {
                this.boxObjectVanilla = new BoxObjectVanilla({
                    child: child

                })
                const name = child.name
                this.boxesArr[name] = this.boxObjectVanilla
                this.container.add(this.boxObjectVanilla.container)
            }
            if (child.name.includes('modInt_')) {
                this.boxObjectInt = new BoxObjectInteractif({
                    child: child
                })
                const name = child.name
                this.boxesArr[name] = this.boxObjectInt
                this.container.add(this.boxObjectVanilla.container)
            }

        })
    }
  }
