const { app, BrowserWindow, dialog } = require('electron')
const isDev = require('electron-is-dev')
const { autoUpdater } = require('electron-updater')

exports.init = () => {
  if (isDev || process.platform === 'linux') {
    return
  }

  autoUpdater.signals.updateDownloaded(versionInfo => {
    const dialogOptions = {
      type: 'question',
      defaultId: 0,
      message: `The update for version ${versionInfo.version} is ready to install, do you want to restart the app now?`,
      buttons: ['OK', 'Cancel']
    }

    const [win] = BrowserWindow.getAllWindows()

    dialog.showMessageBox(win, dialogOptions, res => {
      if (res === 0) {
        app.removeAllListeners('window-all-closed')
        autoUpdater.quitAndInstall(false)
      }
    })
  })

  autoUpdater.checkForUpdates()
}
