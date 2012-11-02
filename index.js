var Emitter = require('emitter')
module.exports = function(nodes, options) {
  return new ScrollPosition()
}

function ScrollPosition(nodes, options) {
	options = options || {}
	nodes = nodes || []
  nodes = ensureArray(nodes)
	this.offset = options.offset || 0
	this.root = window

  this.oldScroll = this.root.scrollY
  this.nodes = nodes.sort(sortByOffset)

	this.root.addEventListener('scroll', this.onScroll.bind(this))
}

function ensureArray(nodes) {
  var result = [];
  for (var i = 0; i < nodes.length; i++) {
    result.push(nodes[startIndex]);
  }
  return result;
}

Emitter(ScrollPosition.prototype)

ScrollPosition.prototype.onScroll = function onScroll(e) {
  var newScroll = this.root.scrollY
  var oldScroll = this.oldScroll
  var scrollingDown = newScroll > oldScroll
  var passedNodes = []
  var nodes = this.nodes
  for(var i = 0; i < nodes.length; i++) {
    var node = nodes[i]
    if (scrollingDown) {
      if (oldScroll < node.offsetTop && newScroll > node.offsetTop) {
        passedNodes.unshift(node)
      }
    } else {
      if (oldScroll > node.offsetTop && newScroll < node.offsetTop) {
        passedNodes.push(node)
      }
    }
  }
  for (var i = 0; i < passedNodes.length; i++) {
    this.emit('scrollOut', passedNodes[i])
  }

  this.oldScroll = newScroll
}

function sortByOffset(a, b) {
  if (a.offsetTop < b.offsetTop) return -1;
  if (a.offsetTop > b.offsetTop) return 1;
  return 0;
}


