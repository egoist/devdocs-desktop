'use strict'
const minimist = require('minimist')
const packager = require('electron-packager')
const exec = require('child_process').exec
const scripy = require('scripy')
const $ = require('shelljs')
const pkg = require('../app/package.json')

const args = minimist(process.argv.slice(2))
const target = args._[0]

const platforms = {}
const defaults = {
  dir: './app',
  'app-version': pkg.version,
  out: 'dist',
  overwrite: true,
  prune: true
}
const cb = (err, paths) => {
  if (err) {
    return console.log(err.message)
  }
  console.log(paths.join('\n'))
}

platforms.macos = () => {
  $.rm('./app/yarn.lock')
  $.rm('-rf', './dist/DevDocs-darwin-x64')
  $.mkdir('-p', './dist/installers')
  packager(Object.assign({}, defaults, {
    platform: 'darwin',
    arch: 'x64',
    'app-bundle-id': 'com.egoistian.devdocs',
    icon: './build/icon.icns'
  }), (err, paths) => {
    cb(err, paths)
    scripy.sync(`appdmg ./build/appdmg.json ./dist/installers/devdocs-macos-${pkg.version}.dmg`, {
      stdio: 'inherit'
    })
  })
}

platforms.linux = () => {
  packager(Object.assign({}, defaults, {
    platform: 'linux',
    arch: 'x64',
    'app-bundle-id': 'com.egoistian.devdocs'
  }), (err, paths) => {
    cb(err, paths)
    exec(`cd dist/devdocs-linux-x64 && zip -ryXq9 ../devdocs-linux-${pkg.version}.zip *`)
  })
}

platforms.windows = () => {
  packager(Object.assign({}, defaults, {
    platform: 'win32',
    arch: 'ia32,x64',
    icon: './build/icon.ico',
    'version-string': {
      productName: pkg.productName
    }
  }), (err, paths) => {
    cb(err, paths)
    exec(`cd dist/devdocs-win32-ia32 && zip -ryXq9 ../devdocs-windows-${pkg.version}.zip *`)
    exec(`cd dist/devdocs-win32-x64 && zip -ryXq9 ../devdocs-windows-${pkg.version}_x64.zip *`)
  })
}

platforms.all = () => {
  platforms.macos()
  platforms.linux()
  platforms.windows()
}

platforms[target]()
