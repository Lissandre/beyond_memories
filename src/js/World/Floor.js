import {
  Object3D,
  Mesh,
  BoxBufferGeometry,
  MeshLambertMaterial,
  RepeatWrapping,
  Raycaster,
  Vector3,
} from 'three'

export default class Floor {
  constructor(options) {
    // Set options
    this.assets = options.assets

    // Set up
    this.container = new Object3D()

    this.setFloor()
  }
  setFloor() {
    // this.floor = new Mesh(
    //   new BoxBufferGeometry(200, 200, 0.1, 1, 1, 1),
    //   new MeshLambertMaterial({ color: 0x959595 })
    // )
    // this.floor.rotateX(-Math.PI / 2)
    // this.floor.receiveShadow = true
    this.floor = this.assets.models.terrain.scene
    this.floor.position.y = 0.3
    // this.floor.scale.set(0.2, 0.2, 0.2)
    this.container.add(this.floor)
  }
  setPhysic() {
    this.size = new Vector3()
    this.center = new Vector3()
    this.calcBox = new Box3().setFromObject(this.container)

    this.calcBox.getSize(this.size)
    this.size.x *= 0.5
    this.size.y *= 0.5
    this.size.z *= 0.5
    this.calcBox.getCenter(this.center)

    this.box = new Box(new Vec3().copy(this.size))


    async function generateHeightfieldFromMesh(mesh/*: Mesh*/, pointDistance/*: number*/, physic) {
      // https://threejs.org/docs/index.html#api/en/core/Raycaster
      const rayCaster = new Raycaster();
      const rayCasterPosition = new Vector3();
      const upAxis = new Vector3(0, 1, 0);
  
      const heightMap = [];
  
      const geometry = mesh.geometry;
      geometry.computeBoundingBox();
      const {
          min: {x: minX, y: minY, z: minZ},
          max: {x: maxX, z: maxZ},
      } = geometry.boundingBox;
      console.log(minX, maxZ);
  
      const width = maxX - minX;
      const length = maxZ - minZ;
  
      const totalX = width / pointDistance + 1;
      const totalZ = length / pointDistance + 1;
      const totalSteps = totalX * totalZ;
      let currentStep = 0;
  
      for (let x = minX; x <= maxX; x += pointDistance) {
          const heightDataRow = [];
          heightMap.push(heightDataRow);
  
          for (let z = maxZ; z >= minZ; z -= pointDistance) {
              rayCasterPosition.set(x, minY, z);
              rayCaster.set(rayCasterPosition, upAxis);
  
              const y = await calculateMeshSurfaceDistanceByRayCast();
  
              heightDataRow.push(y);
          }
      }
      console.log(JSON.stringify(heightMap));
      const terrainShape = new Heightfield(heightMap, {elementSize: pointDistance});
      const heightfield = new Body({ mass: 0, shape: terrainShape });
      heightfield.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
      heightfield.position.set(minX, 0, maxZ);

      console.log(heightfield);
  
      physic.world.addBody(heightfield)
  
      
      function calculateMeshSurfaceDistanceByRayCast() {
          return new Promise((resolve) => {
              window.setTimeout(() => {
                  currentStep++;
  
                  console.log(`generating height field... ${Math.floor(100 / totalSteps * currentStep)}%`);
  
                  const [result] = rayCaster.intersectObject(mesh, true);
                  if(result) resolve(result.distance);
                  else resolve(0)
              });
          });
      }
  }


    this.floor.traverse( (child) => {
      if(child.name === 'Plane') {
        // generateHeightfieldFromMesh(child, 5, this.physic)
        this.shape = new Heightfield(this.data, {elementSize: 5})
        console.log(this.physic.ground_ground_cm);
        const heightfield = new Body({ mass: 0, shape: this.shape, material: this.physic.groundMaterial, allowSleep: false });
        heightfield.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
        heightfield.position.set(-128.95469665527344, 0, 129.0102081298828);
        this.physic.world.addBody(heightfield)

        // console.log(child);
        // const ok = new ConvexHull().setFromObject(child)
        // let p = []

        // ok.vertices.forEach((vert) => {
        //   p.push(vert.point)
        // })

        // const geometry = new ConvexGeometry(p) // create a convex geometry 
        // console.log(geometry);
        // let points = [], // array of Cannon Vec3
        //     faces = [] // array of array of faces see below

        // points = geometry.vertices.map(function (v) {
        //     return new Vec3(v.x, v.y, v.z)
        // })

        // faces = geometry.faces.map(function (f) {
        //     return [f.a, f.b, f.c]
        // })


        // this.shape = threeToCannon(ok, {
        //   type: threeToCannon.Type.HULL,
        // })

        // this.shape = new ConvexPolyhedron({ vertices: points, faces: faces })
        // console.log(child.geometry.attributes.position.array);
        // this.shape = new Heightfield(child.geometry.attributes.position.array)
        // console.log(points);
      }
    })
    
    
  }
}
