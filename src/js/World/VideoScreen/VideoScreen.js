import { Object3D, PlaneGeometry, MeshBasicMaterial, Mesh, VideoTexture } from 'three'
import video from '@textures/video.mp4'
import data from '../../../data/object.json'

export default class VideoScreen {
    constructor(options) {

        this.time = options.time
        this.video = options.video

        this.data = data.monde_1[1]

        this.container = new Object3D()
        this.container.name = this.data.name
        this.isPlayed = false
        this.isCollected = false


        this.tabObject = [this.data]
        this.setPlane()
    
    }

    setPlane() {
        this.videoLoad = this.video;
        this.videoLoad.src = video;
        this.videoLoad.load();
        this.isPlayed = true
        this.texture = new VideoTexture(this.videoLoad);
        this.geo = new PlaneGeometry( 2, 1.125 );
        this.mat = new MeshBasicMaterial( {map: this.texture, transparent: true, opacity: 0.3, color: 0x0000FF} );
        this.plane = new Mesh( this.geo, this.mat );
        this.container.add(this.plane)
        this.container.position.set(0,1,-10)
        this.stopAndGo()
    }

    handleKeySpace(event) {
        switch (event.code) {
            case 'Space': // e
              if(this.isPlayed === true) {
                this.videoLoad.pause()
                this.isPlayed = false
              }else {
                this.videoLoad.play()
                this.isPlayed = true
              }
              break
          }
    }

    stopAndGo() {
        document.addEventListener('keydown', this.handleKeySpace.bind(this), false)
    }
}