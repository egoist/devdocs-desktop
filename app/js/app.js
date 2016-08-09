+(function() {
  'use strict';
  const Vue = require('./vendor/vue')
  const WebView = require('./js/WebView')

  const App = {
    name: 'App',
    render(h) {
      return h(
        'div',
        {
          attrs: {
            id: 'app'
          },
          style: {
            height: '100%'
          }
        },
        [
          h(WebView)
        ]
      )
    }
  }
  const app = new Vue({
    render: h => h(App)
  })
  app.$mount('#app')
})();