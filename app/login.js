const { BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const debug = require('debug')('devdocs-desktop:login')

module.exports = cb => {
  debug('Login launching...')
  const loginWindow = new BrowserWindow({
    width: 300,
    height: 300,
    frame: false,
    resizable: false
  })
  loginWindow.loadURL(`file://${path.join(__dirname, '/renderer/login.html')}`)

  ipcMain.once('login-message', (event, usernameAndPassword) => {
    debug('Login message recieved', usernameAndPassword[0])
    cb(usernameAndPassword[0], usernameAndPassword[1])
    loginWindow.close()
  })
  return loginWindow
}
