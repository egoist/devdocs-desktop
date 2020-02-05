const { ipcRenderer } = require('electron')

document.querySelector('#login-form').addEventListener('submit', event => {
  event.preventDefault()
  ipcRenderer.send('login-message', [
    document.querySelector('#username-input').value,
    document.querySelector('#password-input').value
  ])
})
