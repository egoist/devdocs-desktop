module.exports = class Searcher {
  constructor(target) {
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
  }

  close() {
    this.opened = false
    this.target.stopFindInPage('clearSelection')
    this.$searcher.classList.add('searcher__hidden')
  }

  initialize() {
    const $wrapper = document.createElement('div')
    $wrapper.innerHTML = `
    <div class="searcher searcher__hidden">
      <input class="searcher-input" placeholder="type..." />
      <span class="searcher-progress searcher-progress__disabled"></span>
      <button class="searcher-prev">↑</button>
      <button class="searcher-next">↓</button>
      <button class="searcher-close">✕</button>
    </div>
    `
    document.body.appendChild($wrapper)
    this.$searcher = $wrapper.querySelector('.searcher')
    this.$progress = this.$searcher.querySelector('.searcher-progress')
    this.$input = this.$searcher.querySelector('.searcher-input')
    this.$input.addEventListener('keydown', e => {
      if (e.which === 13) {
        // Enter
        this.findNext(e.target.value)
      } else if (e.which === 27) {
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

      this.$progress.classList.remove('searcher-progress__disabled')
      this.$progress.textContent = `${activeMatchOrdinal}/${matches}`
    })
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
}
