const os = require('os')
const path = require('path')
const fs = require('fs')
const { ipcRenderer, remote, shell } = require('electron')
const mkdirp = require('mkdirp')
const axios = require('axios')
const semverCompare = require('semver-compare')
const contextMenu = require('electron-context-menu')
const { configDir } = require('../utils')
const config = require('../config')
const pkg = require('../package')
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

async function checkUpdates() {
  const api = 'https://api.github.com/repos/egoist/devdocs-app/releases/latest'
  const latest = await axios.get(api).then(res => res.data)

  if (semverCompare(latest.tag_name.slice(1), pkg.version) === 1) {
    const notifier = new Notification('DevDocs', {
      body: `A new version (${latest.tag_name}) is available, click here to view more details!`
    })
    notifier.onclick = () => {
      shell.openExternal(
        'https://github.com/egoist/devdocs-app/releases/latest'
      )
    }
  }
}

ensureCustomFiles()
createWebView()
checkUpdates()

document.body.classList.add(`is-${os.platform()}`)

if (config.get('mode') === 'dark') {
  document.body.classList.add('is-dark-mode')
}

// Check for new release everyday
setInterval(checkUpdates, 1000 * 60 * 60 * 24)
