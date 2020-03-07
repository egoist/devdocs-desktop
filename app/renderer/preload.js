const { ipcRenderer: ipc } = require('electron')
const config = require('../config')

document.addEventListener('change', e => {
  if (e.target.name === 'dark') {
    switchMode(e.target.checked)
  }
})

switchMode(/dark=1;/.test(document.cookie))

function switchMode(isDark) {
  const mode = isDark ? 'dark' : 'light'
  ipc.sendToHost('switch-mode', mode)
}

function setZoom(zoomFactor) {
  const node = document.querySelector('#zoomFactor')
  node.textContent = `body {zoom: ${zoomFactor} !important}`
  config.set('zoomFactor', zoomFactor)
}

document.addEventListener('DOMContentLoaded', () => {
  const zoomFactor = config.get('zoomFactor') || 1
  const style = document.createElement('style')
  style.id = 'zoomFactor'
  document.body.append(style)
  setZoom(zoomFactor)
})

ipc.on('zoom-in', () => {
  const zoomFactor = config.get('zoomFactor') + 0.1

  if (zoomFactor < 1.6) {
    setZoom(zoomFactor)
  }
})

ipc.on('zoom-out', () => {
  const zoomFactor = config.get('zoomFactor') - 0.1

  if (zoomFactor >= 0.8) {
    setZoom(zoomFactor)
  }
})

ipc.on('zoom-reset', () => {
  setZoom(1)
})
