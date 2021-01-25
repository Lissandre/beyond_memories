import { World, SAPBroadphase, Material, ContactMaterial } from 'cannon-es'
import cannonDebugger from 'cannon-es-debugger'

export default class Physic {
  constructor(options) {
    // Set options
    this.time = options.time
    this.debug = options.debug
    this.scene = options.scene
    // this.objects = options.objects

    // Set up
    this.setWorld()
    this.setTime()
    this.setDebug()
  }
  setWorld() {
    this.world = new World()
    this.world.gravity.set(0, -9.82, 0)
    this.world.broadphase = new SAPBroadphase(this.world)
    this.world.solver.iterations = 20
    this.world.allowSleep = true
    this.world.quatNormalizeFast = true
    this.world.bodies.forEach((body) => {
      body.sleepSpeedLimit = 0.01
    })

    this.groundMaterial = new Material('groundMaterial')
    // Adjust constraint equation parameters for ground/ground contact
    this.ground_ground_cm = new ContactMaterial(
      this.groundMaterial,
      this.groundMaterial,
      {
        friction: 1,
        restitution: 0,
        contactEquationStiffness: 1000,
      }
    )
    // Add contact material to the world
    this.world.addContactMaterial(this.ground_ground_cm)
  }
  setTime() {
    this.time.on('tick', () => {
      // this.objects.forEach((object) => {
      //   object.container.position.set(
      //     object.container.body.position.x - object.center.x,
      //     object.container.body.position.y - object.center.y,
      //     object.container.body.position.z - object.center.z
      //   )
      //   object.container.children[0].children[0].quaternion.set(
      //     object.container.body.quaternion.x,
      //     object.container.body.quaternion.y,
      //     object.container.body.quaternion.z,
      //     object.container.body.quaternion.w
      //   )
      // })

      this.world.step(1 / 60, this.time.delta, 3)
    })
  }
  setDebug() {
    if (this.debug) {
      this.physicDebug = { enabled: false }
      this.debugFolder = this.debug.addFolder('Physic')
      this.debugFolder
        .add(this.physicDebug, 'enabled')
        .name('Show bodies')
        .onChange(() => {
          cannonDebugger(this.scene, this.world.bodies)
        })
      this.debugFolder
        .add(this.world.gravity, 'y')
        .name('Gravity')
        .min(1)
        .max(15)
        .step(0.2)
    }
  }
}
