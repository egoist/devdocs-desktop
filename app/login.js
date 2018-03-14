const debug = require('debug')('devdocs-desktop:login');
const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

module.exports = (cb) => {
  debug('Login launching...');
  const loginWindow = new BrowserWindow({
    width: 300,
    height: 400,
    frame: false,
    resizable: false,
  });
  loginWindow.loadURL(`file://${path.join(__dirname, '/renderer/login.html')}`);

  ipcMain.once('login-message', (event, usernameAndPassword) => {
    debug('Login message recieved', usernameAndPassword[0]);
    cb(usernameAndPassword[0], usernameAndPassword[1]);
    loginWindow.close();
  });
  return loginWindow;
}
