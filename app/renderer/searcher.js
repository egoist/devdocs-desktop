const EventEmitter = require('events')

module.exports = class Searcher extends EventEmitter {
  constructor(target) {
    super()
    this.target = target
  }

  toggle() {
    return this.opened ? this.close() : this.open()
  }

  open() {
    if (!this.initialized) this.initialize()
    this.opened = true
    this.$searcher.classList.remove('searcher__hidden')
    this.$input.focus()
    this.$input.select()
    this.emit('open')
  }

  close() {
    this.opened = false
    this.target.stopFindInPage('clearSelection')
    this.hideSearcher()
    this.emit('close')
  }

  initialize() {
    this.initialized = true
    const $wrapper = document.createElement('div')
    $wrapper.innerHTML = `
    <div class="searcher searcher__hidden">
      <input autofocus type="search" class="searcher-input" placeholder="Search..." />
      <span class="searcher-progress searcher-progress__disabled"></span>
      <button class="searcher-action searcher-prev">
        <svg id="i-chevron-top" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M30 20 L16 8 2 20" />
        </svg>
      </button>
      <button class="searcher-action searcher-next">
        <svg id="i-chevron-bottom" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M30 12 L16 24 2 12" />
        </svg>
      </button>
      <button class="searcher-action searcher-close">
        <svg id="i-close" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M2 30 L30 2 M30 30 L2 2" />
        </svg>
      </button>
    </div>
    `
    document.body.append($wrapper)
    this.$searcher = $wrapper.querySelector('.searcher')
    this.$progress = this.$searcher.querySelector('.searcher-progress')
    this.$input = this.$searcher.querySelector('.searcher-input')
    this.$input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        // Enter
        this.findNext(e.target.value)
      } else if (e.key === 'Escape') {
        // Esc
        this.close()
      }
    })
    this.$prev = this.$searcher.querySelector('.searcher-prev')
    this.$next = this.$searcher.querySelector('.searcher-next')
    this.$close = this.$searcher.querySelector('.searcher-close')
    this.$prev.addEventListener('click', () => {
      this.findPrev(this.$input.value)
    })
    this.$next.addEventListener('click', () => {
      this.findNext(this.$input.value)
    })
    this.$close.addEventListener('click', () => {
      this.close()
    })

    this.target.addEventListener('found-in-page', e => {
      const { matches, activeMatchOrdinal } = e.result

      this.showProgress(activeMatchOrdinal, matches)
      this.$input.focus()
    })
    this.emit('initialized')
  }

  findNext(value, opts) {
    if (value) {
      this.target.findInPage(value, opts)
    }

    return this
  }

  findPrev(value, opts) {
    if (value) {
      this.target.findInPage(
        value,
        Object.assign(
          {
            forward: false
          },
          opts
        )
      )
    }

    return this
  }

  showProgress(current, total) {
    this.$progress.classList.remove('searcher-progress__disabled')
    this.$progress.textContent = `${current}/${total}`
  }

  hideSearcher() {
    this.$progress.classList.add('searcher-progress__disabled')
    this.$searcher.classList.add('searcher__hidden')
    this.$input.value = ''
  }
}
