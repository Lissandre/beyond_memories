import '@style/style.styl'
import App from '@js/App'

new App({
  canvas: document.querySelector('#_canvas'),
  text_01: document.querySelector('.text_01'),
  text_02: document.querySelector('.text_02'),
  video: document.querySelector('.video'),
  openInventory: document.querySelector('.js_inventoryBtn'),
  closeInventory: document.querySelector('.js_closeInventory'),
  body: document.querySelector('#_body')
})
