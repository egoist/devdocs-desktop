const isDev = require('electron-is-dev')
const log = require('electron-log')
const { autoUpdater } = require('electron-updater')

exports.init = () => {
  if (isDev || process.platform === 'linux') {
    return
  }

  autoUpdater.logger = log
  autoUpdater.logger.transports.file.level = 'info'
  autoUpdater.checkForUpdatesAndNotify()
}
