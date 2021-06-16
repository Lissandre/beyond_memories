import '@style/style.styl'
import App from '@js/App'

new App({
  canvas: document.querySelector('#_canvas'),
  openInventory: document.querySelector('.js_inventoryBtn'),
  closeInventory: document.querySelector('.js_closeInventory'),
  body: document.querySelector('#_body'),
  itemsInventory: document.querySelector('[data-inventory-items]'),
})
