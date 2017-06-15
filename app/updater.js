const { app, BrowserWindow, dialog } = require('electron')
const os = require('os')
const autoUpdater = require('electron-updater').autoUpdater

exports.init = () => {
  const platform = os.platform()
  if (platform === 'linux') {
    return
  }

  autoUpdater.signals.updateDownloaded(versionInfo => {
    const dialogOptions = {
      type: 'question',
      defaultId: 0,
      message: `The update is ready to install, Version ${versionInfo.version} has been downloaded and will be automatically installed`
    }

    const focusedWindow = BrowserWindow.getFocusedWindow()

    BrowserWindow.getAllWindows()

    dialog.showMessageBox(focusedWindow, dialogOptions, () => {
      setImmediate(() => {
        app.removeAllListeners('window-all-closed')
        if (focusedWindow !== null) {
          focusedWindow.close()
        }
        autoUpdater.quitAndInstall(false)
      })
    })
  })

  autoUpdater.checkForUpdates()
}
