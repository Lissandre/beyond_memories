import { Object3D, DirectionalLight, DirectionalLightHelper, Vector3, SphereBufferGeometry, MeshPhongMaterial, Mesh, cloneUniformsm, CameraHelper } from "three"

export default class Sun {
    constructor(options) {
        
        //Set options
        this.debug = options.debug
        this.time = options.time

        this.color = options.color
        this.intensity = options.intensity

        // Set up
        this.container = new Object3D()

        this.createSun()
    }

    createSun() {
        this.light = new DirectionalLight(this.color, this.intensity)
        this.light.castShadow = true
        console.log(this.light.shadow.camera);
        this.light.shadow.camera.top = 100
        this.light.shadow.camera.bottom = -100
        this.light.shadow.camera.left = -100
        this.light.shadow.camera.right = 100
        // this.light.shadow.mapSize.width = 2048
        // this.light.shadow.mapSize.height = 2048
        this.light.shadow.camera.updateProjectionMatrix()
        // this.light.shadow.camera.visible = true
        this.target = new Vector3(0, 0, 0)

        this.geometry = new SphereBufferGeometry(5,10,10)
        this.mat = new MeshPhongMaterial(0xfcd303)
        this.sun = new Mesh(this.geometry, this.mat)
        // this.light.target = this.target

        this.helper = new DirectionalLightHelper(this.light, 10)
        this.camHelper = new CameraHelper(this.light.shadow.camera  )

        this.container.add(this.light, this.helper, this.sun, this.camHelper)
    }
}