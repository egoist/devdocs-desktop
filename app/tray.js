const path = require('path')
const { app, Menu, Tray } = require('electron')
const config = require('./config')

let tray = null

exports.create = (win, app) => {
  if (tray) {
    return
  }

  let iconPath;
  if (process.platform === 'darwin') {
    if (config.get('floating')) {
      iconPath = path.join(__dirname, 'static/tray-mac.png')
    } else {
      return
    }
  } else {
    iconPath = path.join(__dirname, 'static/tray.png')
  }

  const toggleWin = () => {
    if (win.isVisible()) {
      win.hide()
    } else {
      win.show()
    }
  }

  let menuItems = [
    {
      label: 'Toggle Window',
      click() {
        toggleWin()
      }
    }
  ];
  if (process.platform === 'darwin') {
    menuItems = menuItems.concat([
      {
        label: 'Turn Off Floating Mode',
        click() {
          config.set('floating', false)
          app.relaunch()
          app.exit()
        }
      },
    ])
  }
  menuItems = menuItems.concat([
    {
      type: 'separator'
    },
    {
      role: 'quit'
    }
  ])

  const contextMenu = Menu.buildFromTemplate(menuItems)

  tray = new Tray(iconPath)
  tray.setToolTip(`${app.getName()}`)
  tray.setContextMenu(contextMenu)
  tray.on('click', toggleWin)
}
