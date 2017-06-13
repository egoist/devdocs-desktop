const fs = require('fs')
const { ipcRenderer, remote, shell } = require('electron')
const mkdirp = require('mkdirp')
const contextMenu = require('electron-context-menu')
const { configDir } = require('../utils')
const Searcher = require('./searcher')

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

ensureCustomFiles()

// Create webview
const webview = document.createElement('webview')
webview.className = 'webview'
webview.src = 'https://devdocs.io'
webview.preload = configDir('custom.js')
document.body.appendChild(webview)

// Initialize in-page searcher
const searcher = new Searcher(webview)

ipcRenderer.on('toggle-search', () => {
  searcher.toggle()
})

webview.addEventListener('dom-ready', () => {
  // Insert custom css
  webview.insertCSS(fs.readFileSync(configDir('custom.css'), 'utf8'))
  // Add context menus
  contextMenu({
    window: webview,
    showInspectElement: true
  })
})

// Update app title
webview.addEventListener('did-stop-loading', () => {
  win.setTitle(webview.getTitle())
})

webview.addEventListener('new-window', e => {
  e.preventDefault()
  shell.openExternal(e.url)
})
