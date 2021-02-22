import { Object3D, UniformsUtils, ShaderMaterial, AmbientLight, DirectionalLight } from 'three'
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes'
import { ToonShaderHatching } from 'three/examples/jsm/shaders/ToonShader'

import AmbientLight from '../Lights/AmbientLight'
import DirectionalLight from '../Lights/DirectionalLight'

export default class Blob {
  constructor(options) {
    //Set options
    this.debug = options.debug
    this.time = options.time

    // Set up
    this.container = new Object3D()

    this.createBlob()
  }

  createBlob() {
    let resolution

    resolution = 28

    this.ambientLight =  new AmbientLight({
      debug: this.debugFolder,
    })

    this.light = new DirectionalLight({
      debug: this.debugFolder,
    })

    this.bubbleMat = this.createShaderMaterial(ToonShaderHatching, this.light, this.ambientLight)

    this.effect = new MarchingCubes(resolution, this.bubbleMat, false, false)
    this.effect.position.set(0, 0, 0)
    this.effect.scale.set(700, 700, 700)

    this.container.add(this.effect)
  }

  createShaderMaterial(shader, light, ambientLight) {

    this.u = UniformsUtils.clone(shader.uniforms);

    this.vs = shader.vertexShader;
    this.fs = shader.fragmentShader;

    this.material = new ShaderMaterial({ uniforms: this.u, vertexShader: this.vs, fragmentShader: this.fs });

    this.material.uniforms["uDirLightPos"].value = light.position
    this.material.uniforms["uDirLightColor"].value = light.color

    this.material.uniforms["uAmbientLightColor"].value = ambientLight.color

    return this.material;

  }
}