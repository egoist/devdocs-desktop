'use strict'
const fs = require('fs')
const path = require('path')
const electron = require('electron')
const windowStateKeeper = require('electron-window-state')
const app = electron.app
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow
const appMenu = require('./menu')

// const isDev = process.env.NODE_ENV === 'development'

let mainWindow

function createWindow() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  })

  mainWindow = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    titleBarStyle: 'hidden-inset',
    webPreferences: {
      nodeIntegration: false
    }
  })

  mainWindowState.manage(mainWindow)

  mainWindow.loadURL(`https://devdocs.io/`)

  mainWindow.on('closed', () => {
    mainWindowState.unmanage(mainWindow)
    mainWindow = null
  })

  const page = mainWindow.webContents

  page.on('dom-ready', () => {
    page.insertCSS(fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf8'))
    page.executeJavaScript(fs.readFileSync(path.join(__dirname, 'browser.js')))
  })

  page.on('new-window', (e, url) => {
    e.preventDefault()
    electron.shell.openExternal(url)
  })
}

app.on('ready', () => {
  Menu.setApplicationMenu(appMenu)
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
