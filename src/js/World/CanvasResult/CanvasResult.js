export default class CanvasResult {
    constructor(options) {

        this.playerInventory = options.playerInventory
        this.body = options.body
        
        this.createCanvas()
    }

    createCanvas() {
        let canvasField = document.createElement('canvas')
        canvasField.classList.add('js_canvasResult')
        canvasField.width = 1920
        canvasField.height = 1080
        this.body.appendChild(canvasField)
        console.log('create canvas');
        // setTimeout(function() {
        //     let canvas = document.querySelector('.js_canvasResult')
        //     let context = canvas.getContext('2d')
        // }, 500)
        

        // this.playerInventory.forEach(element => {
        //     let base_image = new Image()
        //     base_image.src = element.data.links.image
        //     base_image.onload = function() {
        //         context.drawImage(base_image, (Math.random() * 100), (Math.random()*100))
        //     }
        // });
    }

   
}