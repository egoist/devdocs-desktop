const { Menu, shell, globalShortcut, BrowserWindow } = require('electron')
const { configDir, toggleGlobalShortcut } = require('./utils')
const config = require('./config')

function sendAction(action) {
  const [win] = BrowserWindow.getAllWindows()

  if (process.platform === 'darwin') {
    win.restore()
  }

  win.webContents.send(action)
}

function updateMenu(opts) {
  Menu.setApplicationMenu(createMenu(opts))
}

function createMenu(opts) {
  const toggleAppAccelerator =
    config.get('shortcut.toggleApp') || 'CmdOrCtrl+Shift+D'
  const toggleAppAcceleratorRegistered = globalShortcut.isRegistered(
    toggleAppAccelerator
  )

  const preferences = [
    {
      label: 'Preferences',
      submenu: [
        {
          label: 'Custom CSS',
          click() {
            shell.openItem(configDir('custom.css'))
          }
        },
        {
          label: 'Custom JS',
          click() {
            shell.openItem(configDir('custom.js'))
          }
        },
        {
          label: `${toggleAppAcceleratorRegistered ? 'Disable' : 'Enable'} Global Shortcut`,
          click() {
            toggleGlobalShortcut({
              name: 'toggleApp',
              registered: toggleAppAcceleratorRegistered,
              accelerator: toggleAppAccelerator,
              action: opts.toggleWindow
            })
            updateMenu(opts)
          }
        }
      ]
    },
    {
      type: 'separator'
    }
  ]

  const template = [
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo'
        },
        {
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          role: 'paste'
        },
        {
          role: 'pasteandmatchstyle'
        },
        {
          role: 'delete'
        },
        {
          role: 'selectall'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reset Text Size',
          accelerator: 'CmdOrCtrl+0',
          click() {
            sendAction('zoom-reset')
          }
        },
        {
          label: 'Increase Text Size',
          accelerator: 'CmdOrCtrl+Plus',
          click() {
            sendAction('zoom-in')
          }
        },
        {
          label: 'Decrease Text Size',
          accelerator: 'CmdOrCtrl+-',
          click() {
            sendAction('zoom-out')
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Search In Page',
          accelerator: 'CmdOrCtrl+F',
          click(item, focusedWindow) {
            focusedWindow.webContents.send('open-search')
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload()
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin'
            ? 'Alt+Command+I'
            : 'Ctrl+Shift+I',
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools()
          }
        }
      ]
    },
    {
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        },
        {
          role: 'close'
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: 'DevDocs',
      submenu: [
        {
          role: 'about'
        },
        {
          type: 'separator'
        },
        ...preferences,
        {
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    })
    // Edit menu.
    template[1].submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'Speech',
        submenu: [
          {
            role: 'startspeaking'
          },
          {
            role: 'stopspeaking'
          }
        ]
      }
    )
    // Window menu.
    template[3].submenu = [
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Zoom',
        role: 'zoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        role: 'front'
      }
    ]
  } else {
    template.push({
      label: 'Preferences',
      submenu: preferences[0].submenu
    })
  }

  template.push({
    role: 'help',
    submenu: [
      {
        label: 'Report Issues',
        click() {
          shell.openExternal('http://github.com/egoist/devdocs-app/issues/new')
        }
      }
    ]
  })

  return Menu.buildFromTemplate(template)
}

module.exports = createMenu
