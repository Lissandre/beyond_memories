export default class CanvasResult {
    constructor(options) {

        this.playerInventory = options.playerInventory
        this.body = options.body
        
        this.createCanvas()
        this.drawCanvas()
    }

    createCanvas() {
        let canvasField = document.createElement('canvas')
        canvasField.classList.add('js_canvasResult')
        canvasField.width = 1920
        canvasField.height = 1080
        this.body.appendChild(canvasField)
        

        // this.playerInventory.forEach(element => {
        //     let base_image = new Image()
        //     base_image.src = element.data.links.image
        //     base_image.onload = function() {
        //         context.drawImage(base_image, (Math.random() * 100), (Math.random()*100))
        //     }
        // });
    }

    drawCanvas() {
        this.canvas = document.querySelector('.js_canvasResult')
        let context = this.canvas.getContext('2d')
        this.canvasRect = this.canvas.getBoundingClientRect()
        console.log(this.canvasRect);
        context.fillStyle = '#000000';
        context.fillRect(0, 0, 1920, 1080);
        this.playerInventory.forEach(element => {
            this.base_image = new Image()
            this.base_image.src = element.links.image
            this.base_image.onload = function() {
                // this.context.drawImage(this.base_image, (Math.random() * 100), (Math.random()*100))
                context.drawImage(this.base_image, 0, 0)
                console.log(context);
            }
        });
    }
   
}