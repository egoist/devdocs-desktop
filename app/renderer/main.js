const os = require('os')
const path = require('path')
const fs = require('fs')
const { ipcRenderer: ipc, remote, shell } = require('electron')
const mkdirp = require('mkdirp')
const contextMenu = require('electron-context-menu')
const { configDir } = require('../utils')
const config = require('../config')
const Searcher = require('./searcher')

const isMac = process.platform === 'darwin'

const win = remote.getCurrentWindow()
let webview // eslint-disable-line prefer-const

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

function createHeader() {
  const header = document.createElement('header')
  header.className = 'header'
  header.innerHTML = `<h1 id="title" class="app-title">Loading DevDocs...</h1>`
  header.addEventListener('dblclick', () => {
    win.maximize()
  })
  header.addEventListener('click', () => {
    webview.focus()
  })

  document.body.appendChild(header)
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

  searcher.on('close', () => {
    webview.focus()
  })

  ipc.on('open-search', () => {
    searcher.open()
  })

  ipc.on('zoom-in', () => {
    webview.send('zoom-in')
  })

  ipc.on('zoom-out', () => {
    webview.send('zoom-out')
  })

  ipc.on('zoom-reset', () => {
    webview.send('zoom-reset')
  })

  ipc.on('focus-webview', () => {
    webview.focus()
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
    const css = `
    ._app button:focus {
      outline: none;
    }
    ._app button._search-clear {
      top: .5rem;
    }
    `
    webview.insertCSS(css + fs.readFileSync(configDir('custom.css'), 'utf8'))
    webview.executeJavaScript(fs.readFileSync(configDir('custom.js'), 'utf8'))
    webview.focus()
    // Add context menus
    contextMenu({
      window: webview,
      showInspectElement: true,
      append(props, win) {
          const hasText = props.selectionText.trim().length > 0
          return [
            {
              id: 'showDefinition',
              label: 'Show definition',
              enabled: hasText && isMac,
              visible: hasText && isMac,
              click() {
                win.showDefinitionForSelection()
              }
            },
            {
              id: 'searchGoogle',
              label: 'Search in Google',
              enabled: hasText,
              visible: hasText,
              click() {
                shell.openExternal(`https://www.google.com/search?q=${props.selectionText}`)
              }
            },
            {
              id: 'searchDuck',
              label: 'Search in DuckDuckGo',
              enabled: hasText,
              visible: hasText,
              click() {
                shell.openExternal(`https://duckduckgo.com/?q=${props.selectionText}`)
              }
            }
          ]
        }
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

  return webview
}

ensureCustomFiles()
createHeader()
webview = createWebView()

document.body.classList.add(`is-${os.platform()}`)

if (config.get('mode') === 'dark') {
  document.body.classList.add('is-dark-mode')
}
