import { Object3D, PlaneGeometry, MeshBasicMaterial, Mesh, VideoTexture } from 'three'
import video from '@textures/video.mp4'

export default class VideoScreen {
    constructor(options) {

        this.time = options.time
        this.video = options.video

        this.container = new Object3D()
        this.container.name = "VideoScreen"

        this.isPlayed = false

        this.setPlane()
    
    }

    setPlane() {
        this.videoLoad = this.video;
        console.log(document.querySelector('.video'));
        this.videoLoad.src = video;
        this.videoLoad.load();
        this.videoLoad.play();
        this.isPlayed = true
        this.texture = new VideoTexture(this.videoLoad);
        this.geo = new PlaneGeometry( 2, 1.125 );
        this.mat = new MeshBasicMaterial( {map: this.texture} );
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
                console.log(this.isPlayed);
              }else {
                this.videoLoad.play()
                this.isPlayed = true
                console.log(this.isPlayed);
              }
              break
          }
    }

    stopAndGo() {
        document.addEventListener('keydown', this.handleKeySpace.bind(this), false)
    }
}