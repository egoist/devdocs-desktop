document.addEventListener('DOMContentLoaded', () => {
  process.nextTick(() => {
    const _set = app.Settings.prototype.set
    app.Settings.prototype.set = function (key, value) {
      const event = new CustomEvent('settings:change', { detail: { key, value }})
      window.dispatchEvent(event)
      return _set.call(this, key, value)
    }
    document.documentElement.classList.toggle('dark-theme', !!app.settings.get('dark'))

    window.addEventListener('settings:change', ({ detail: { key, value } }) => {
      switch (key) {
        case 'dark':
          document.documentElement.classList.toggle('dark-theme', !!value)
          break;
        default:
          break;
      }
    })
  })
})
