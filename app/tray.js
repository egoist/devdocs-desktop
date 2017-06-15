const path = require('path')
const { app, Menu, Tray } = require('electron')

let tray = null

exports.create = win => {
  if (process.platform === 'darwin' || tray) {
    return
  }

  const iconPath = path.join(__dirname, 'static/tray.png')

  const toggleWin = () => {
    if (win.isVisible()) {
      win.hide()
    } else {
      win.show()
    }
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Toggle',
      click() {
        toggleWin()
      }
    },
    {
      type: 'separator'
    },
    {
      role: 'quit'
    }
  ])

  tray = new Tray(iconPath)
  tray.setToolTip(`${app.getName()}`)
  tray.setContextMenu(contextMenu)
  tray.on('click', toggleWin)
}
