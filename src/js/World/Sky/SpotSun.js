import { Object3D, SpotLight, SpotLightHelper, PlaneBufferGeometry, MeshBasicMaterial, Mesh, Color } from 'three'

export default class SpotSun {
  constructor(options) {
    this.position = options.position
    this.intensity = options.intensity
    this.distanceSpot = options.distanceSpot
    this.angleSpot = options.angleSpot
    this.debug = options.debug

    this.container = new Object3D()
    this.color = 0xffebb0

    this.params = {
        color: 0xffe358
    }

    this.createAmbientLight()
    if(this.debug) {
        this.setDebug()
    }
  }

  createAmbientLight() {
    this.light = new SpotLight(this.params.color, this.intensity, this.distanceSpot, this.angleSpot, 1, 2, 1)
    this.light.position.set(this.position.x, this.position.y, this.position.z)


    this.geometry = new PlaneBufferGeometry( 5, 20, 32 )
    this.material = new MeshBasicMaterial( {color: 0xffff00, opacity: 0, transparent: true} )
    this.plane = new Mesh( this.geometry, this.material )
    this.plane.position.set(0,-10,0)
    this.plane.rotation.y = Math.PI/2

    this.light.target = this.plane

    this.helper = new SpotLightHelper(this.light, '#ff0000')

    this.container.add(this.light, this.plane)
  }

  setDebug() {
    this.debugFolder = this.debug.addFolder('Spot Soleil')
    this.debugFolder
        .addColor(this.params, 'color')
        .name('sun light Color')
        .onChange(() => {
            this.light.color = new Color(this.params.color)
        })
    this.debugFolder
        .add(this.light, 'intensity')
        .name('Intensity')
        .min(0)
        .max(10)
        .step(0.1)
    this.debugFolder
        .add(this.light, 'distance')
        .name('Distance')
        .min(0)
        .max(500)
        .step(0.1)
    this.debugFolder
        .add(this.light, 'angle')
        .name('Angle')
        .min(0)
        .max(500)
        .step(0.1)
  }
}