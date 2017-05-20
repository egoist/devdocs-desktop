const path = require('path')
const fs = require('fs')
const electron = require('electron')
const appMenu = require('./menu')
const config = require('./config')
const tray = require('./tray')

const app = electron.app

require('electron-debug')()
require('electron-context-menu')()

let mainWindow
let isQuitting = false

const isAlreadyRunning = app.makeSingleInstance(() => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }

    mainWindow.show()
  }
})

if (isAlreadyRunning) {
  app.quit()
}

function createMainWindow() {
  const lastWindowState = config.get('lastWindowState')

  const win = new electron.BrowserWindow({
    title: app.getName(),
    show: false,
    x: lastWindowState.x,
    y: lastWindowState.y,
    width: lastWindowState.width,
    height: lastWindowState.height,
    titleBarStyle: 'hidden-inset',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'browser.js'),
      nodeIntegration: false,
      plugins: true
    }
  })

  if (process.platform === 'darwin') {
    win.setSheetOffset(40)
  }

  win.loadURL('https://devdocs.io')

  win.on('close', e => {
    if (!isQuitting) {
      e.preventDefault()

      if (process.platform === 'darwin') {
        app.hide()
      } else {
        win.hide()
      }
    }
  })

  win.on('page-title-updated', e => {
    e.preventDefault()
  })

  return win
}

app.on('ready', () => {
  electron.Menu.setApplicationMenu(appMenu)
  mainWindow = createMainWindow()
  tray.create(mainWindow)

  const page = mainWindow.webContents

  page.on('dom-ready', () => {
    page.insertCSS(fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf8'))

    try {
      page.insertCSS(fs.readFileSync(path.join(__dirname, 'plat', process.platform + '.css'), 'utf8'))
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err
      }
    }

    mainWindow.show()
  })

  page.on('new-window', (e, url) => {
    e.preventDefault()
    electron.shell.openExternal(url)
  })
})

app.on('activate', () => {
  mainWindow.show()
})

app.on('before-quit', () => {
  isQuitting = true

  if (!mainWindow.isFullScreen()) {
    config.set('lastWindowState', mainWindow.getBounds())
  }
})
