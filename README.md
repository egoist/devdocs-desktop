# DevDocs App

[DevDocs.io](https://devdocs.io/) combines multiple API documentations in a fast, organized, and searchable interface. This is an unoffcial desktop app for it.

![2016-08-11 10 55 18](https://cloud.githubusercontent.com/assets/8784712/17592907/b7715f96-6016-11e6-97a4-8f04976460ed.png)

## Features

### Background behavior

When closing the window, the app will continue running in the background, in the dock on macOS and the tray on Linux/Windows. Right-click the dock/tray icon and choose Quit to completely quit the app. On macOS, click the dock icon to show the window. On Linux, right-click the tray icon and choose Toggle to toggle the window. On Windows, click the tray icon to toggle the window.

### Keyboard shortcuts

`devdocs` the website itself has great built-in shortcuts support, just check the `help` page in the app.

## Download

You can manually download the latest release [here](https://github.com/egoist/devdocs-app/releases).

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
