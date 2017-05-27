const path = require('path')
const fs = require('fs')
const electron = require('electron')
const mkdirp = require('mkdirp')
const appMenu = require('./menu')
const config = require('./config')
const tray = require('./tray')
const { configDir } = require('./utils')

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

function ensureCustomFiles() {
  mkdirp.sync(configDir())
  const css = configDir('custom.css')
  const js = configDir('custom.js')
  if (!fs.existsSync(css)) {
    fs.writeFileSync(css, '', 'utf8')
  }
  if (!fs.existsSync(js)) {
    fs.writeFileSync(js, '', 'utf8')
  }
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
      preload: configDir('custom.js'),
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
  ensureCustomFiles()
  electron.Menu.setApplicationMenu(appMenu)
  mainWindow = createMainWindow()
  tray.create(mainWindow)

  const page = mainWindow.webContents

  page.on('dom-ready', () => {
    page.insertCSS(fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf8'))
    page.insertCSS(fs.readFileSync(configDir('custom.css'), 'utf8'))

    if (process.platform === 'darwin') {
      page.insertCSS(fs.readFileSync(path.join(__dirname, 'macos.css'), 'utf8'))
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
