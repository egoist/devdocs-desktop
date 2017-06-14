const os = require('os')
const path = require('path')
const fs = require('fs')
const { ipcRenderer, remote, shell } = require('electron')
const mkdirp = require('mkdirp')
const contextMenu = require('electron-context-menu')
const { configDir } = require('../utils')
const Searcher = require('./searcher')
const config = require('../config')

const win = remote.getCurrentWindow()

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

function createWebView() {
  // Create webview
  const webview = document.createElement('webview')
  webview.className = 'webview'
  webview.src = 'https://devdocs.io'
  webview.preload = `file://${path.join(__dirname, 'preload.js')}`
  document.body.appendChild(webview)

  // Initialize in-page searcher
  const searcher = new Searcher(webview)

  ipcRenderer.on('toggle-search', () => {
    searcher.toggle()
  })

  webview.addEventListener('ipc-message', e => {
    if (e.channel === 'switch-mode') {
      const [mode] = e.args
      config.set('mode', mode)
      if (mode === 'dark') {
        document.body.classList.add(`is-dark-mode`)
      } else {
        document.body.classList.remove(`is-dark-mode`)
      }
    }
  })

  webview.addEventListener('dom-ready', () => {
    // Insert custom css
    webview.insertCSS(fs.readFileSync(configDir('custom.css'), 'utf8'))
    webview.executeJavaScript(fs.readFileSync(configDir('custom.js'), 'utf8'))
    // Add context menus
    contextMenu({
      window: webview,
      showInspectElement: true
    })
  })

  // Update app title
  webview.addEventListener('did-stop-loading', () => {
    const title = webview.getTitle()
    win.setTitle(title)
    document.getElementById('title').textContent = title
  })

  webview.addEventListener('new-window', e => {
    e.preventDefault()
    shell.openExternal(e.url)
  })
}

ensureCustomFiles()
createWebView()

document.body.classList.add(`is-${os.platform()}`)

if (config.get('mode') === 'dark') {
  document.body.classList.add('is-dark-mode')
}
