import EventEmitter from './EventEmitter.js'

export default class Mouse extends EventEmitter {
  constructor() {
    // Get parent methods
    super()

    // Set up
    this.canvas = document.querySelector('canvas')
    this.grab = false
    this.position = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }
    this.oldPosition = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }
    this.canvas.addEventListener('mousemove', (_event) => {
      this.mousemove(_event)
    })
    this.mousedown = this.mousedown.bind(this)
    this.canvas.addEventListener('mousedown', this.mousedown)
    this.mousedown()
    this.mouseup = this.mouseup.bind(this)
    this.canvas.addEventListener('mouseup', this.mouseup)
    this.mouseup()
  }
  // on('mousemove')
  mousemove(_event) {
    this.oldPosition = this.position
    this.position = {
      x: _event.clientX,
      y: _event.clientY,
    }
    this.delta = {
      x: this.position.x - this.oldPosition.x,
      y: this.position.y - this.oldPosition.y,
    }
    // Add trigger event
    this.trigger('mousemove')
  }
  // on('mousedown')
  mousedown() {
    this.grab = true
    document.body.style.cursor = 'grabbing'
    // Add trigger event
    this.trigger('mousedown')
  }
  // on('mouseup')
  mouseup() {
    this.grab = false
    document.body.style.cursor = 'default'
    // Add trigger event
    this.trigger('mouseup')
  }
}
