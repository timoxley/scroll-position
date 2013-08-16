var domify = require('component-domify')
var assert = require('timoxley-assert')
var ScrollPosition = require('scroll-position')
var nodes = []

var SCROLL_AMOUNT = 50
var SCROLL_FREQUENCY = 30
var NUM_ELS = 4

function generateNodes(num) {
  var nodes = []
	for(var i = 0; i < num; i++) {
    var node = generateNode(i)
		document.body.appendChild(node)
		nodes.push(node)
	}
  return nodes
}

function generateNode(id) {
  if (id == null) id = new Date().valueOf()
  return domify('<div class="node" id="node-'+id+'" style="height: 100px; width: 200px; outline: 1px red solid;"></div>')
}

function prepareForScroll(n) {
	document.body.style.paddingBottom = document.height + 100 * n // Give us enough room to scroll
}

var scrolling;
function startScrolling(amount, frequency) {
  clearInterval(scrolling)
  scrolling = setInterval(function() {
    window.scrollBy(0, amount || SCROLL_AMOUNT)
  }, frequency || SCROLL_FREQUENCY)
}

function startScrollingUp() {
  startScrolling(-SCROLL_AMOUNT)
}

function endScrolling() {
	document.body.style.paddingBottom = 0
  clearInterval(scrolling)
  scrollToTop()
}

function scrollToBottom() {
  window.scrollTo(0, document.height)
}
function scrollToTop() {
  window.scrollTo(0, 0)
}

describe('scroll-position', function() {
  mocha.timeout(500)
  beforeEach(function() {
    nodes = []
    // reset so testing is more sensible
    ScrollPosition.defaultOffsetOut = 0
  })

  afterEach(function() {
    nodes.map(document.body.removeChild.bind(document.body))
    nodes = []
    endScrolling()
  })

  describe('scrolling down past a single node', function() {
    beforeEach(function() {
      prepareForScroll(1)
      nodes = generateNodes(1)
    })

    it('triggers an event when it passes', function(done) {
      var sp = ScrollPosition(nodes)
      sp.on('out', function(el) {
        assert.equal(nodes[0], el)
        sp.off('out')
        done()
      })
      startScrolling()
    })
  })

  describe('scrolling up past a single node', function() {
    beforeEach(function() {
      prepareForScroll(1)
      scrollToBottom()
      nodes = generateNodes(1)
    })
    it('triggers an event when it passes', function(done) {
      var sp = ScrollPosition(nodes)
      sp.on('in', function(el) {
        assert.equal(nodes[0], el)
        sp.off('in')
        done()
      })
      startScrollingUp()
    })
  })


  describe('scrolling down past multiple nodes', function() {
    beforeEach(function() {
      prepareForScroll(NUM_ELS)
      nodes = generateNodes(NUM_ELS)
    })
    it('triggers an event when it passes', function(done) {
      var sp = ScrollPosition(nodes)
      var scrolled = []
      sp.on('out', function(el) {
        scrolled.push(el)
        if (scrolled.length >= NUM_ELS) {
          for (var i = 0; i < scrolled.length; i++) {
            assert.equal(nodes[i], scrolled[i])
          }
          sp.off('out')
          done()
        }
      })
      startScrolling()
    })
  })

  describe('scrolling up past multiple nodes', function() {
    beforeEach(function() {
      prepareForScroll(NUM_ELS)
      scrollToBottom()
      nodes = generateNodes(NUM_ELS)
    })
    it('triggers an event when it passes', function(done) {
      var sp = ScrollPosition(nodes)
      var scrolled = []
      sp.on('in', function(el) {
        scrolled.push(el)
        if (scrolled.length >= NUM_ELS) {
          scrolled.reverse()
          for (var i = 0; i < scrolled.length; i++) {
            assert.equal(nodes[i], scrolled[i])
          }
          sp.off('in')
          done()
        }
      })
      startScrollingUp()
    })
  })

  describe('inOut on up and down', function() {
    beforeEach(function() {
      prepareForScroll(NUM_ELS)
      nodes = generateNodes(NUM_ELS)
    })
    it('triggers events for down and up', function(done) {
      this.timeout(4000)
      var sp = ScrollPosition(nodes)
      var scrolled = []
      sp.on('inOut', function(el) {
        scrolled.push(el)
        // go back up at half-way
        if (scrolled.length === NUM_ELS) return scrollToTop()
        if (scrolled.length === NUM_ELS * 2) {
          // should check scrolled = els down then els up but
          // too hard to check
          sp.off('inOut')
          done()
        }
      })
      startScrolling()
    })
  })

  describe('taking a nodelist', function() {
    beforeEach(function() {
      prepareForScroll(NUM_ELS)
      nodes = generateNodes(NUM_ELS)
    })
    it('triggers an event when it passes', function(done) {
      this.timeout(4000)
      var sp = ScrollPosition(document.querySelectorAll('.node'))
      var scrolled = []
      sp.on('out', function(el) {
        scrolled.push(el)
        if (scrolled.length >= NUM_ELS) {
          for (var i = 0; i < scrolled.length; i++) {
            assert.equal(nodes[i], scrolled[i])
          }
          sp.off('out')
          done()
        }
      })
      startScrolling()
    })
  })
})
