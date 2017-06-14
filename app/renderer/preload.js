const { ipcRenderer } = require('electron')

document.addEventListener('change', e => {
  if (e.target.name === 'dark') {
    switchMode(e.target.checked)
  }
})

switchMode(/dark=1;/.test(document.cookie))

function switchMode(isDark) {
  const mode = isDark ? 'dark' : 'light'
  ipcRenderer.sendToHost('switch-mode', mode)
}
