import { Object3D, BoxGeometry, MeshBasicMaterial, Mesh } from 'three'

export default class RCcar {
    constructor(options) {

        this.time = options.time
        this.assets = options.assets

        this.container = new Object3D()
        this.container.name = "car"

        this.setCar()
    
    }

    setCar() {
        this.car = this.assets.models.car.scene
        this.car.scale.set(0.1, 0.1, 0.1)
        this.car.castShadow = true
        this.container.add(this.car)
        this.container.position.set(5,0,-10)

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