export default class CanvasResult {
    constructor(options) {

        this.playerInventory = options.playerInventory
        this.body = options.body

        this.spots = [0,1,2,3,4,5,6,7]        
        
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
        context.fillStyle = '#000000';
        context.fillRect(0, 0, 1920, 1080);

        this.logo = new Image()
        this.logo.src = "./assets/background.jpeg"
        this.logo.onload = ()=>{
            context.drawImage(this.logo, 0, 0 )
        }
        this.playerInventory.forEach(element => {

            let spotIndex = Math.floor(Math.random() * this.spots.length)
            let spot = this.spots[spotIndex]
            this.spots.splice(spotIndex, 1)
            let row = Math.floor(spot/4)
            let column = spot%4

            console.log(spot, 'row:' + row, 'column:' + column);
            const base_image = new Image()
            console.log(element.links.image);
            base_image.src = element.links.image
            this.imageRect = base_image.getBoundingClientRect()



            base_image.onload = ()=>{
                const rotation = Math.random() * 20 - 10
                const random = Math.random() / 5
                console.log(this.canvas);
                const ox = this.canvas.width / 2
                const oy = this.canvas.height / 2
                context.translate(ox, oy)
                context.rotate(rotation * Math.PI / 180)
                context.translate(-ox, -oy)

                context.drawImage(
                    base_image, 
                    (1920 / 4 * column) + (Math.random() * (1920-470) /4), 
                    (1080 / 2 * row) + (Math.random() * (1080-570) / 2),
                    base_image.width * (0.7 - random),
                    base_image.height * (0.7 - random)
                )

                context.translate(ox, oy)
                context.rotate(-rotation * Math.PI / 180)
                context.translate(-ox, -oy)
                // context.drawImage(this.base_image, 0, 0)
            }
        });

        setTimeout(()=>{
            let link = document.createElement('a');
            link.download = `Beyond_Memories_Your_Childhood.png`;
            link.href = this.canvas.toDataURL()
            link.click();
        }, 2000)

    }
   
}