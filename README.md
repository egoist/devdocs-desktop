# DevDocs Desktop

[![version](https://img.shields.io/github/release/egoist/devdocs-desktop.svg?style=flat-square)](https://github.com/egoist/devdocs-desktop/releases) [![downloads](https://img.shields.io/github/downloads/egoist/devdocs-desktop/total.svg?style=flat-square)](https://github.com/egoist/devdocs-desktop/releases) [![downloads latest](https://img.shields.io/github/downloads/egoist/devdocs-desktop/latest/total.svg?style=flat-square)](https://github.com/egoist/devdocs-desktop/releases/latest) [![travis](https://img.shields.io/travis/egoist/devdocs-desktop.svg?style=flat-square)](https://travis-ci.org/egoist/devdocs-desktop) [![appveyor](https://img.shields.io/appveyor/ci/egoist/devdocs-desktop.svg?style=flat-square)](https://ci.appveyor.com/project/egoist/devdocs-desktop) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat-square)](https://github.com/egoist/donate) [![chat](https://img.shields.io/badge/chat-on%20discord-7289DA.svg?style=flat-square)](https://chat.egoist.moe)

[DevDocs.io](https://devdocs.io/) combines multiple API documentations in a fast, organized, and searchable interface. This is an unoffcial desktop app for it.

![devdocs-preview](https://user-images.githubusercontent.com/8784712/27121730-11676ba8-511b-11e7-8c01-00444ee8501a.png)



## Features

### Background behavior

When closing the window, the app will continue running in the background, in the dock on macOS and the tray on Linux/Windows. Right-click the dock/tray icon and choose Quit to completely quit the app. On macOS, click the dock icon to show the window. On Linux, right-click the tray icon and choose Toggle to toggle the window. On Windows, click the tray icon to toggle the window.

### Build-in shortcuts

`devdocs` the website itself has great built-in shortcuts support, just check the `help` page in the app.

<img src="https://ooo.0o0.ooo/2017/06/14/59402442301b8.png" alt="help" width="300" />

### Global shortcut

Use <kbd>Ctrl+Shift+D</kbd> (or <kbd>Command+Shift+D</kbd> on macOS) to toggle the app.

## Download

You can manually download the latest release [here](https://github.com/egoist/devdocs-desktop/releases).

## Development

It's really easy to develop this app, no build tools like Webpack needed here, checkout [./app](/app) to get more:

```bash
$ npm install

$ npm run app
# edit files, save, refresh and it's done.
```

## Distribute

```bash
$ npm run dist:mac
$ npm run dist:linux
$ npm run dist:win
```

## License

MIT &copy; [EGOIST](https://github.com/egoist)


