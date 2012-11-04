/**
 * Module dependencies.
 */

var Emitter = require('emitter')
var offset = require('offset')
var toArray = require('to-array')

/**
 * ScrollPosition factory
 *
 * @param {Array.<HTMLElement>} nodes
 * @return {ScrollPosition}
 * @api public
 */

module.exports = function(nodes, options) {
  return new ScrollPosition(nodes, options)
}

/**
 * Initialise a new `ScrollPosition`
 *
 * @api public
 */

function ScrollPosition(nodes, options) {
  options = options || {}
	nodes = nodes || []

  // convert NodeLists etc into arrays
  nodes = toArray(nodes)

  this.offset = options.offset || 0

	this.root = window
  this.nodes = nodes.sort(sortByOffset)

  this.root.addEventListener('scroll', this.onScroll.bind(this))
  this.onScroll() // trigger once to initialise
}

Emitter(ScrollPosition.prototype)

/**
 * Scroll event handler. Fires `scrollOut` events.
 *
 * @api private
 */

ScrollPosition.prototype.onScroll = function onScroll() {
  // initialize oldScroll
  var oldScroll = this.oldScroll = (this.oldScroll === undefined) ? this.root.scrollY : this.oldScroll

  var newScroll = this.root.scrollY
  // how much we scrolled between last event and this event
  var scrollDelta = oldScroll - newScroll

  var nodes = this.nodes
  var offset = this.offset

  var scrolledOut = nodes
    .filter(isScrolledOut.bind(null, offset, scrollDelta))
  var scrolledIn = nodes
    .filter(isScrolledIn.bind(null, offset, scrollDelta))

  // fire scrollIn events
  scrolledOut
    .map(this.emit.bind(this, 'scrollOut'))

  // fire scrollOut events
  scrolledIn
    .map(this.emit.bind(this, 'scrollIn'))

  // fire scrollChange events for both
  scrolledOut
    .concat(scrolledIn)
    .map(this.emit.bind(this, 'scrollInOut'))

  this.oldScroll = newScroll
}

/**
 * True if a node has been scrolled out.
 *
 * @param {Number} baseOffset Base offset for detecting scroll changes
 * @param {Number} scrollDelta Scroll difference
 * @param {HTMLElement} node
 * @return {Boolean} true of element was scrolled out
 * @api private
 */

function isScrolledOut(baseOffset, scrollDelta, node) {
  var offsetTop = offset(node).y
  return (offsetTop < baseOffset && offsetTop >= scrollDelta)
}

/**
 * True if a node has been scrolled in.
 *
 * @param {Number} baseOffset Base offset for detecting scroll changes
 * @param {Number} scrollDelta Scroll difference
 * @param {HTMLElement} node
 * @return {Boolean} true of element was scrolled in
 * @api private
 */

function isScrolledIn(baseOffset, scrollDelta, node) {
  var offsetTop = offset(node).y
  return (offsetTop > baseOffset && offsetTop <= scrollDelta)
}

/**
 * Function for sorting an array of HTMLElements by their offset.
 *
 * @api private
 */

function sortByOffset(a, b) {
  if (offset(a).y < offset(b).y) return -1
  if (offset(a).y > offset(b).y) return 1
  return 0
}
