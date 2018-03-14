const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

document.getElementById('login-form')
  .addEventListener('submit', (event) => {
    event.preventDefault();
    ipcRenderer.send('login-message', [
      document.getElementById('username-input').value,
      document.getElementById('password-input').value
    ]);
  });
