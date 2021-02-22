import { Object3D, UniformsUtils, ShaderMaterial, AmbientLight, DirectionalLight, PointLight, Color, MeshLambertMaterial } from 'three'
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes'
import { ToonShaderHatching } from 'three/examples/jsm/shaders/ToonShader'

// import AMBLight from '../Lights/AmbientLight'
// import DirectionalLight from '../Lights/DirectionalLight'

export default class MarchingBlob {
  constructor(options) {
    //Set options
    this.time = options.time

    this.effectController = {

      speed: 1.0,
      numBlobs: 10,
      resolution: 28,
      isolation: 80,

      floor: true,

      hue: 0.2,
      saturation: 1,
      lightness: 0.9,

      lhue: 0.04,
      lsaturation: 1.0,
      llightness: 0.5,

      lx: 0.5,
      ly: 0.5,
      lz: 1.0,

    };
    this.goTime = 0

    // Set up
    this.container = new Object3D()

    this.createBlob()
  }

  createBlob() {

    this.resolution = 10

    this.light = new DirectionalLight(0xFF0000)
    this.light.position.set(0.5, 0.5, 1)
    this.container.add(this.light)

    this.pointLight = new PointLight(0xff3300)
    this.pointLight.position.set(0, 0, 100)
    this.container.add(this.pointLight)

    this.ambientLight = new AmbientLight(0x080808)
    this.container.add(this.ambientLight)


    this.bubbleMat = this.createShaderMaterial(ToonShaderHatching, this.light, this.ambientLight)
    this.effect = new MarchingCubes(this.resolution, this.bubbleMat, true, true)
    this.effect.position.set(0, 0, 0)
    this.effect.scale.set(2, 2, 2)

    this.effect.enableUvs = false;
    this.effect.enableColors = false;

    this.animate()
    this.container.add(this.effect)

  }

  createShaderMaterial(shader, light, ambientLight) {

    this.u = UniformsUtils.clone(shader.uniforms);

    this.vs = shader.vertexShader;
    this.fs = shader.fragmentShader;

    this.material = new ShaderMaterial({ uniforms: this.u, vertexShader: this.vs, fragmentShader: this.fs })

    this.material.uniforms["uDirLightPos"].value = light.position
    this.material.uniforms["uDirLightColor"].value = light.color

    this.material.uniforms["uAmbientLightColor"].value = ambientLight.color

    return this.material;

  }

  updateCubes(object, time, numblobs) {

    object.reset();

    // fill the field with some metaballs

    const subtract = 12;
    const strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);

    for (let i = 0; i < numblobs; i++) {

      const ballx = Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 + 0.5;
      const bally = Math.abs(Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) * 0.77; // dip into the floor
      const ballz = Math.cos(i + 1.32 * time * 0.1 * Math.sin((0.92 + 0.53 * i))) * 0.27 + 0.5;

      object.addBall(ballx, bally, ballz, strength, subtract);

    }

    object.addPlaneY(2, 200)
  }

  animate() {
    this.time.on('tick', () => {

      this.goTime += this.time.delta/1000 * this.effectController.speed * 0.5

      if (this.effectController.resolution !== this.resolution) {

        this.resolution = this.effectController.resolution;
        this.effect.init(Math.floor(this.resolution));

      }

      if (this.effectController.isolation !== this.effect.isolation) {

        this.effect.isolation = this.effectController.isolation;

      }

      this.updateCubes(this.effect, this.goTime, this.effectController.numBlobs);

      // materials

      this.effect.material.uniforms["uBaseColor"].value.setHSL(this.effectController.hue, this.effectController.saturation, this.effectController.lightness)

      // lights

      this.light.position.set(this.effectController.lx, this.effectController.ly, this.effectController.lz);
      this.light.position.normalize();

      this.pointLight.color.setHSL( this.effectController.lhue, this.effectController.lsaturation, this.effectController.llightness );

    })
  }
}