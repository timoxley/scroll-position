var Emitter = require('emitter')

/**
 * ScrollPosition factory
 *
 * @return {ScrollPosition}
 * @api public
 */

module.exports = function(nodes) {
  return new ScrollPosition(nodes)
}

/**
 * Initialise a new `ScrollPosition`
 *
 * @api public
 */

function ScrollPosition(nodes) {
	nodes = nodes || []

  // convert NodeLists etc into arrays
  nodes = ensureArray(nodes)

	this.root = window
  this.oldScroll = this.root.scrollY
  this.nodes = nodes.sort(sortByOffset)

  this.root.addEventListener('scroll', this.onScroll.bind(this))
}

Emitter(ScrollPosition.prototype)

/**
 * Scroll event handler. Fires `scrollOut` events.
 *
 * @api private
 */

ScrollPosition.prototype.onScroll = function onScroll(e) {
  var newScroll = this.root.scrollY
  var scrolledOut = getScrolledOut(this.oldScroll, newScroll, this.nodes)
  for (var i = 0; i < scrolledOut.length; i++) {
    this.emit('scrollOut', scrolledOut[i])
  }
  this.oldScroll = newScroll
}

/**
 * Calculates which nodes have been scrolled out.
 *
 * @param {Number} oldScroll
 * @param {Number} newScroll
 * @param {Array.<HTMLElement>} nodes
 * @return {Array.<HTMLElement>} nodes that were scrolled out
 * @api private
 */

function getScrolledOut(oldScroll, newScroll, nodes) {
  var scrolledOut = []
  var scrollingDown = newScroll > oldScroll
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i]
    var offsetTop = node.offsetTop
    if (scrollingDown) {
      if (oldScroll <= offsetTop && newScroll >= offsetTop) {
        scrolledOut.unshift(node)
      }
    } else {
      if (oldScroll >= offsetTop && newScroll <= offsetTop) {
        scrolledOut.push(node)
      }
    }
  }
  return scrolledOut
}

/**
 * Function for sorting an array of HTMLElements by their offsetTop.
 *
 * @api private
 */

function sortByOffset(a, b) {
  if (a.offsetTop < b.offsetTop) return -1
  if (a.offsetTop > b.offsetTop) return 1
  return 0
}

/**
 * Convert an array-like object into an `Array`.
 *
 * @param {Mixed} collection Array or array-like object e.g. an array, arguments or NodeList
 * @return {Array} Naive attempt at converting input to Array
 * @api private
 */

function ensureArray(collection) {
  if (Array.isArray(collection)) return collection

  var arr = []
  for (var i = 0; i < collection.length; i++) {
    arr.push(collection[i])
  }
  return arr
}
