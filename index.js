var Emitter = require('emitter')
module.exports = function(nodes, options) {
	nodes = nodes || []
	options = options || {}
	var offset = options.offset || 0
	var root = window

	var emitter = new Emitter()
	root.addEventListener('scroll', function(e) {
		closestNext()
	})
	return emitter
	var target = 
}

module.exports._closestNext = closestNext

function nextClosestNode(nodes, target) {
	var largerNumbers = nodes.filter(function(node) {
		return node.offsetTop > target
	})
	largerNumbers.sort()
	return largerNumbers[0]
}
