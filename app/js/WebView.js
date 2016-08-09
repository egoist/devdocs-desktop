const url = require('url')
const {shell} = require('electron')

module.exports = {
  name: 'WebView',
  mounted() {
    const {webview} = this.$refs 
    webview.addEventListener('dom-ready', () => {
      webview.insertCSS(`
        button, input {
          outline: none !important;
        }
      `)
    })
    webview.addEventListener('new-window', e => {
      const protocol = url.parse(e.url).protocol
      if (protocol === 'http:' || protocol === 'https:') {
        shell.openExternal(e.url)
      }
    })
  },
  render(h) {
    return h(
      'webview',
      {
        attrs: {
          src: 'https://devdocs.io/'
        },
        ref: 'webview',
        style: {
          height: '100%'
        }
      }
    )
  }
}