var Emitter = require('emitter')
module.exports = function(nodes) {
  return new ScrollPosition(nodes)
}

function ScrollPosition(nodes) {
	nodes = nodes || []
  nodes = ensureArray(nodes)
	this.root = window

  this.oldScroll = this.root.scrollY
  this.nodes = nodes.sort(sortByOffset)
	this.root.addEventListener('scroll', this.onScroll.bind(this))
}

function ensureArray(nodes) {
  var result = [];
  for (var i = 0; i < nodes.length; i++) {
    result.push(nodes[i]);
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
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i]
    var offsetTop = node.offsetTop
    if (scrollingDown) {
      if (oldScroll < offsetTop && newScroll > offsetTop) {
        passedNodes.unshift(node)
      }
    } else {
      if (oldScroll > offsetTop && newScroll < offsetTop) {
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
  if (a.offsetTop < b.offsetTop) return -1
  if (a.offsetTop > b.offsetTop) return 1
  return 0
}


