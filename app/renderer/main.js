const fs = require('fs')
const { ipcRenderer, remote, shell } = require('electron')
const mkdirp = require('mkdirp')
const searchInPage = require('electron-in-page-search').default
const { configDir } = require('../utils')

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

webview.addEventListener('dom-ready', () => {
  // Insert custom css
  webview.insertCSS(fs.readFileSync(configDir('custom.css'), 'utf8'))
  // Add context menu to webview
  require('electron-context-menu')({
    window: webview,
    showInspectElement: true
  })
})

// Listen event for toggling search bar
const inPageSearch = searchInPage(webview)
ipcRenderer.on('toggle-search', () => {
  if (inPageSearch.opened) {
    inPageSearch.closeSearchWindow()
  } else {
    inPageSearch.openSearchWindow()
  }
})

// Update app title
webview.addEventListener('did-stop-loading', () => {
  win.setTitle(webview.getTitle())
})

webview.addEventListener('new-window', (e, url) => {
  e.preventDefault()
  shell.openExternal(e.url)
})
