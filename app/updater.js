const { app, BrowserWindow, dialog } = require('electron')
const os = require('os')
const isDev = require('electron-is-dev')
const { autoUpdater } = require('electron-updater')

exports.init = () => {
  const platform = os.platform()
  if (isDev || platform === 'linux') {
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
        autoUpdater.quitAndInstall(false)
      }
    })
  })

  autoUpdater.checkForUpdates()
}
