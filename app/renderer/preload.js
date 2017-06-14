const { ipcRenderer } = require('electron')

document.addEventListener('change', e => {
  const mode = e.target.checked ? 'dark' : 'light'
  ipcRenderer.sendToHost('switch-mode', mode)
})
