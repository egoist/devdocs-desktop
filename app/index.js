'use strict'
const fs = require('fs')
const path = require('path')
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const isDev = process.env.NODE_ENV === 'development'

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden-inset'
  })

  mainWindow.loadURL(`https://devdocs.io/`)

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  const page = mainWindow.webContents

  page.on('dom-ready', () => {
    page.insertCSS(fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf8'))
  })

  page.on('new-window', (e, url) => {
		e.preventDefault()
		electron.shell.openExternal(url)
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})