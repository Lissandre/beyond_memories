import { Object3D } from 'three'
import BoxObjectVanilla from './BoxObjectVanilla'
import BoxObjectInteractif from './BoxObjectInteractif'

export default class BoxObjectManager {


    constructor(options) {
        
        //Set options
        this.time = options.time
        this.debug = options.debug
        this.assets = options.assets

        this.boxesArr = []

        this.container = new Object3D()
        
        this.createBoxes()
        this.animate()
    }
    
    createBoxes() {
        this.floor = this.assets.models.MAP.scene
        this.floor.traverse((child) => {
            if (child.name.includes('mod_')) {
                this.boxObjectVanilla = new BoxObjectVanilla({
                    child: child
                })
                this.boxesArr.push(this.boxObjectVanilla)
                // console.log(this.boxesArr);
                this.container.add(this.boxObjectVanilla.container)
            }
            if (child.name.includes('modInt_')) {
                this.boxObjectVanilla = new BoxObjectInteractif({
                    child: child
                })
                this.boxesArr.push(this.boxObjectVanilla)
                // console.log(this.boxesArr);
                this.container.add(this.boxObjectVanilla.container)
            }
            
        })

    }

    animate() {
        this.time.on('tick', ()=> {

            
        })
    }


}