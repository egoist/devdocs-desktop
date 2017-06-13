module.exports = class Searcher {
  constructor(target) {
    this.target = target
  }

  toggle() {
    return this.opened ? this.close() : this.open()
  }

  open() {
    if (!this.initialized) this.initialize()

    this.$searcher.classList.remove('searcher__hidden')
    this.$input.focus()
  }

  close() {
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
    </div>
    `
    document.body.appendChild($wrapper)
    this.$searcher = $wrapper.querySelector('.searcher')
    this.$progress = this.$searcher.querySelector('.searcher-progress')
    this.$input = this.$searcher.querySelector('.searcher-input')
    this.$input.addEventListener('keydown', e => {
      if (e.which === 13) {
        // Enter
        this.target.findInPage(e.target.value)
      } else if (e.which === 27) {
        // Esc
        this.target.stopFindInPage('clearSelection')
        this.close()
      }
    })
    this.$prev = this.$searcher.querySelector('.searcher-prev')
    this.$next = this.$searcher.querySelector('.searcher-next')
    this.$prev.addEventListener('click', () => {
      this.target.findInPage(this.$input.value, {
        forward: false
      })
    })
    this.$next.addEventListener('click', () => {
      this.target.findInPage(this.$input.value)
    })

    this.target.addEventListener('found-in-page', e => {
      const { matches, activeMatchOrdinal } = e.result
      if (this.matches === 0) {
        this.$progress.classList.add('searcher-progress__disabled')
      } else {
        this.$progress.classList.remove('searcher-progress__disabled')
        this.$progress.textContent = `${activeMatchOrdinal}/${matches}`
      }
    })
  }
}
