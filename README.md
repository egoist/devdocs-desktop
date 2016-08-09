# DevDocs App

A full-featured desktop app for [DevDocs.io](https://devdocs.io/).

## About

In case you have no idea about DevDocs, it's some free alternative to the famous [Dash](https://kapeli.com/dash) app on macOS.

## Features

- Offline use.
- Multi tabs support (WIP).

## Todo

- Package for macOS/windows

## Development

It's really easy to develop this app, no build tools like Webpack needed here, checkout [./app](/app) to get more:

```bash
$ npm install

$ npm run app
# edit files, save, refresh and it's done.
```

The stack we use:

- Electron
- Vue 2
- Hyperscript (Vue 2, we don't use template, just the render function and hyperscript)

```js
const myComponent = {
  // the render function
  render(h) {
    // the following code is exactly hyperscriot
    return h('div', 'hey!')
  }
}
```

## License

MIT &copy; [EOIST](https://github.com/egoist)