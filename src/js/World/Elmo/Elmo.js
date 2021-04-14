import { Object3D, BoxGeometry, MeshBasicMaterial, Mesh } from 'three'

export default class Elmo {
    constructor(options) {

        this.time = options.time
        this.assets = options.assets

        this.container = new Object3D()
        this.container.name = "elmo"

        this.setElmo()
    
    }

    setElmo() {
        this.elmo = this.assets.models.elmo.scene
        this.elmo.scale.set(0.3, 0.3, 0.3)
        this.elmo.castShadow = true
        this.container.add(this.elmo)
        this.container.position.set(0,0.5,-10)

        this.setCollider()
    }

    setCollider() {
        this.geometry = new BoxGeometry( 4, 4, 4 );
        this.material = new MeshBasicMaterial( {color: 0x00ff00, wireframe: true} );
        this.cube = new Mesh( this.geometry, this.material )
        this.cube.position.set(0,1,0)
        this.container.add(this.cube)
    }

}
