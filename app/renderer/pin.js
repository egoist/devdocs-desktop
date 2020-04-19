const { remote } = require('electron')
const EventEmitter = require('events')

module.exports = class Pin extends EventEmitter {
  constructor(target) {
    super()
    this.target = target
  }

  toggle() {
    return this.pinned ? this.unpin() : this.pin()
  }

  pin() {
    // TODO: make floating
    this.$pinBtn.classList.remove('pinned')
    this.emit('pin')
  }

  unpin() {
    // TODO: make unfloating
    this.$pinBtn.classList.remove('pinned')
    this.emit('unpin')
  }

  initialize() {
    const header = document.querySelector('header')
    this.$pinBtn = document.createElement('div')
    $pinBtn.innerHTML = `
    <button class="pin pinned">
    <svg>
    <g transform="matrix(1.12753,1.12753,-1.20192,1.20192,14.311,-16.8507)">
        <path d="M14.048,17.496L12.294,17.494L11.625,7.673L10.668,7.673L9.979,4.659L20.654,4.659L20.097,7.673L19.008,7.673L18.476,17.501L16.444,17.499L15.934,23.962L14.699,23.962L14.048,17.496ZM19.877,7.428L20.344,4.904L10.302,4.904L10.879,7.428L11.87,7.428L12.539,17.249L14.286,17.251L14.937,23.717L15.691,23.717L16.201,17.253L18.228,17.256L18.76,7.428L19.877,7.428Z"/>
    </g>
    </svg>
    </button>
    `
    header.appendChild($pinBtn)
    this.$pinBtn.addEventListener('click', () => {
        this.toggle()
    })
    this.emit('initialized')
  }
}
