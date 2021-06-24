import { Object3D, BufferGeometry, PointsMaterial, Float32BufferAttribute, Points } from 'three'
import * as Noise from 'perlin-simplex'

export default class Particles {
  constructor(options) {
    // Set options
    this.debug = options.debug
    this.time = options.time
    this.number = options.number

    // Set up
    this.container = new Object3D()
    this.container.name = 'Particule'
    this.params = { 
        color: 0XFF0000,
        opacity: 1,
        size: 0.5,
        transparent: true 
    }

    this.createParticule()
    this.animateParticles()

    if (this.debug) {
      this.setDebug()
    }
  }
  createParticule() {
    this.particles = new BufferGeometry()
    this.vertices = []
    this.pMaterial = new PointsMaterial({
        color: this.params.color,
        opacity: this.params.opacity,
        size: this.params.size,
        transparent: this.params.transparent
    })

    for (let p = 0; p < 150; p++) {
        const pX = Math.random() * 200 - 120
        const pY = Math.random() * 20 + 2
        const pZ = Math.random() * 200 - 70

        this.vertices.push(pX, pY, pZ)
    }

    this.particles.setAttribute('position', new Float32BufferAttribute(this.vertices, 3))

    this.particlesMesh = new Points(this.particles, this.pMaterial)
    console.log();
    this.container.add(this.particlesMesh)
  }
  setDebug() {
    this.debugFolder = this.debug.addFolder('Ambient Light')
    this.debugFolder
      .addColor(this.params, 'color')
      .name('Color')
      .onChange(() => {
        this.light.color = new Color(this.params.color)
      })
  }
  
  animateParticles() {
      this.count = 1
      this.counter = 0
      this.simplex = new Noise()
      console.log(this.simplex);
      this.time.on('tick', ()=>{
        this.counter ++
        
        this.pMaterial.opacity = (Math.sin(this.counter / 60) + 1) / 2
        
      })
  }
  
}
