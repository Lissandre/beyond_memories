import { Object3D } from 'three'

export default class Elmo {
    constructor(options) {

        this.time = options.time
        this.assets = options.assets

        this.container = new Object3D()

        this.setElmo()
    
    }

    setElmo() {
        this.elmo = this.assets.models.elmo.scene
        this.elmo.scale.set(0.3, 0.3, 0.3)
        this.elmo.castShadow = true
        this.container.add(this.elmo)
        this.container.position.set(0,0,-10)
    }

}