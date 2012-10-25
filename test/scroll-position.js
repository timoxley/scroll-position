var domify = require('component-domify')
var scrollPosition = require('scroll-position')
var NUM_NODES = 10;
var nodes = []

beforeEach(function() {
	nodes = []
	document.body.style.paddingBottom = 20000 // Give us enough room to scroll
	for(var i = 0; i < NUM_NODES; i++) {
		var node = domify('<div class="node" id="node-'+i+'" style="height: 100px; width: 200px; outline: 1px red;"></div>')
		document.body.appendChild(node)
		nodes.push(node)
		console.log(node.id, node.offsetTop)
	}

})
afterEach(function() {
	nodes.map(document.body.removeChild.bind(document.body))
})

describe('scrolling window', function() {
	var scrolling
	var SCROLL_AMOUNT = 50
	beforeEach(function() {
		scrolling = setInterval(function() {
			window.scrollBy(0, SCROLL_AMOUNT)
		}, 100)
	})
	afterEach(function() {
		clearInterval(scrolling)
		window.scrollTo(0, 0)
	})
	it('trigger events when hitting dom nodes', function(done) {
		var e = scrollPosition(nodes)
		var count = 0
		e.on('scrolledTo', function() {
			console.log.apply(console, arguments)
		})
	})
})


