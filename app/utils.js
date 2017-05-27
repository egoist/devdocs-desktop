const os = require('os')
const path = require('path')

const home = os.homedir()

exports.configDir = function(...args) {
  return path.join(home, '.devdocs', ...args)
}
