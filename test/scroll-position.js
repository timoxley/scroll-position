var domify = require('component-domify')
var assert = require('timoxley-assert')
var scrollPosition = require('scroll-position')
var nodes = []

var SCROLL_AMOUNT = 50
var SCROLL_FREQUENCY = 10


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

beforeEach(function() {
	nodes = []
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
    this.timeout(1000)
    var sp = scrollPosition(nodes)
    sp.on('scrollOut', function(el) {
      assert.equal(nodes[0], el)
      sp.off('scrollOut')
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
    this.timeout(1000)
    var sp = scrollPosition(nodes)
    sp.on('scrollOut', function(el) {
      assert.equal(nodes[0], el)
      sp.off('scrollOut')
      done()
    })
    startScrollingUp()
  })
})


describe('scrolling down past multiple nodes', function() {
  beforeEach(function() {
    prepareForScroll(4)
    nodes = generateNodes(4)
  })
  it('triggers an event when it passes', function(done) {
    this.timeout(4000)
    var sp = scrollPosition(nodes)
    var scrolled = []
    sp.on('scrollOut', function(el) {
      scrolled.push(el)
      if (scrolled.length >= 4) {
        for (var i = 0; i < scrolled.length; i++) {
          assert.equal(nodes[i], scrolled[i])
        }
        sp.off('scrollOut')
        done()
      }
    })
    startScrolling()
  })
})

describe('scrolling up past multiple nodes', function() {
  beforeEach(function() {
    prepareForScroll(4)
    scrollToBottom()
    nodes = generateNodes(4)
  })
  it('triggers an event when it passes', function(done) {
    this.timeout(4000)
    var sp = scrollPosition(nodes)
    var scrolled = []
    sp.on('scrollOut', function(el) {
      scrolled.push(el)
      if (scrolled.length >= 4) {
        scrolled.reverse()
        for (var i = 0; i < scrolled.length; i++) {
          assert.equal(nodes[i], scrolled[i])
        }
        sp.off('scrollOut')
        done()
      }
    })
    startScrollingUp()
  })
})

describe('taking a nodelist', function() {
  beforeEach(function() {
    prepareForScroll(4)
    nodes = generateNodes(4)
  })
  it('triggers an event when it passes', function(done) {
    this.timeout(4000)
    var sp = scrollPosition(document.querySelectorAll('.node'))
    var scrolled = []
    sp.on('scrollOut', function(el) {
      scrolled.push(el)
      if (scrolled.length >= 4) {
        for (var i = 0; i < scrolled.length; i++) {
          assert.equal(nodes[i], scrolled[i])
        }
        sp.off('scrollOut')
        done()
      }
    })
    startScrolling()
  })

})
