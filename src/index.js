import '@style/style.styl'
import App from '@js/App'

new App({
  canvas: document.querySelector('#_canvas'),
  openInventory: document.querySelector('.js_inventoryBtn'),
  closeInventory: document.querySelector('.js_closeInventory'),
  openOptions: document.querySelector('.js_optionsBtn'),
  closeOptions: document.querySelector('.js_closeOptions'),
  body: document.querySelector('#_body'),
  itemsInventory: document.querySelector('[data-inventory-items]'),
  screenShot: document.querySelector('.js_screenShot'),
  initButton: document.querySelector('.js_initButton'),
  music: document.querySelector('.js_music'),
  musicRange: document.querySelector('#_music'),
  ambianceRange: document.querySelector('#_ambiance'),
  js_musicVol: document.querySelector('.js_musicVol'),
  js_ambianceVol: document.querySelector('.js_ambianceVol'),
  muteButton: document.querySelector('.js_muteSound'),
  unmuteButton: document.querySelector('.js_unmuteSound'),
})
