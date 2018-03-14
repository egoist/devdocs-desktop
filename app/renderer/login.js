const { ipcRenderer } = require('electron')

document.getElementById('login-form').addEventListener('submit', event => {
  event.preventDefault()
  ipcRenderer.send('login-message', [
    document.getElementById('username-input').value,
    document.getElementById('password-input').value
  ])
})
