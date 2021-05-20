export default class CanvasResult {
    constructor(options) {

        this.playerInventory = options.playerInventory
        this.body = options.body

        this.base_image
        
        this.createCanvas()
        this.drawCanvas()
    }

    createCanvas() {
        let canvasField = document.createElement('canvas')
        canvasField.classList.add('js_canvasResult')
        canvasField.width = 1920
        canvasField.height = 1080
        this.body.appendChild(canvasField)

        setTimeout(()=> {
            this.body.removeChild(canvasField)
        },2000)
    }

    drawCanvas() {
        this.canvas = document.querySelector('.js_canvasResult')
        let context = this.canvas.getContext('2d')
        this.canvasRect = this.canvas.getBoundingClientRect()
        console.log(this.canvasRect);
        context.fillStyle = '#000000';
        context.fillRect(0, 0, 1920, 1080);
        this.logo = new Image()
        this.logo.src = "./assets/object/logo_beyond.png"
        this.logo.onload = ()=>{
            context.drawImage(this.logo, 0, 0 )
        }
        this.playerInventory.forEach(element => {
            this.base_image = new Image()
            this.base_image.src = element.links.image
            this.imageRect = this.base_image.getBoundingClientRect()
            this.base_image.onload = ()=>{
                context.drawImage(this.base_image, (Math.random() * 1200), (Math.random()*500))
                // context.drawImage(this.base_image, 0, 0)
            }
        });

        setTimeout(()=>{
            let link = document.createElement('a');
            link.download = `Beyond_Memories_Your_Childhood.png`;
            link.href = this.canvas.toDataURL()
            link.click();
        }, 1000)

    }
   
}