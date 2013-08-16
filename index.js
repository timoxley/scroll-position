
/**
 * Module dependencies.
 */

var Emitter = require('emitter')
var throttle = require('throttle')
var toArray = Function.call.bind([].slice)

/**
 * ScrollPosition factory
 *
 * @param {Array.<HTMLElement>} nodes
 * @return {ScrollPosition}
 * @api public
 */

module.exports = ScrollPosition

/**
 * Class-level variables
 * @api public
 */

ScrollPosition.defaultOffsetOut = 100
ScrollPosition.defaultOffsetIn = 0

/**
 * Initialise a new `ScrollPosition`
 *
 * @api public
 */

function ScrollPosition(nodes, options) {
  if (!(this instanceof ScrollPosition)) return new ScrollPosition(nodes, options)
  options = options || {}
  nodes = nodes || []

  // convert NodeLists etc into arrays
  nodes = toArray(nodes)

  this.offsetOut = options.offsetOut || ScrollPosition.defaultOffsetOut
  this.offsetIn = options.offsetIn || ScrollPosition.defaultOffsetIn

  // throttle scroll events
  options.throttle = options.throttle !== undefined
    ? options.throttle
    : 20

  this.root = window
  this.nodes = nodes.sort(sortByOffset)

  this.root.addEventListener('scroll', throttle(options.throttle, this.onScroll.bind(this)))
  this.onScroll() // trigger once to initialise
}

Emitter(ScrollPosition.prototype)

/**
 * Scroll event handler. Fires `scrollOut` events.
 *
 * @api private
 */

ScrollPosition.prototype.onScroll = function onScroll() {
  var nodes = this.nodes
  var offsetOut = this.offsetOut
  var offsetIn = this.offsetIn

  // initialize oldScroll
  var oldScroll = this.oldScroll = this.oldScroll === undefined
    ? this.root.scrollY
    : this.oldScroll

  var newScroll = this.root.scrollY
  // how much we scrolled between last event and this event
  var scrollDelta = oldScroll - newScroll
  // figure out which nodes scrolled in or out
  var scrolledOut = nodes
    .filter(isScrolledOut.bind(null, offsetOut, scrollDelta))
  var scrolledIn = nodes.slice().reverse()
    .filter(isScrolledIn.bind(null, offsetIn, scrollDelta))

  // fire scrollOut events
  scrolledOut.forEach(this.emit.bind(this, 'out'))

  // fire scrollIn events
  scrolledIn.forEach(this.emit.bind(this, 'in'))

  // fire scrollInOut events for both
  scrolledOut
    .concat(scrolledIn)
    .forEach(this.emit.bind(this, 'inOut'))

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
  var offsetTop = node.getBoundingClientRect().top
  var previous = offsetTop - scrollDelta
  // if previously was scrolled in
  if (previous >= baseOffset) {
    // and falls below offset threshold
    return (offsetTop < baseOffset)
  }
  return false
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
  var offsetTop = node.getBoundingClientRect().top
  var previous = offsetTop - scrollDelta
  // if previously was scrolled out
  if (previous <= baseOffset) {
    // and falls beyond offset threshold
    return (offsetTop >= baseOffset)
  }
  return false

}

/**
 * Function for sorting an array of HTMLElements by their offset.
 *
 * @api private
 */

function sortByOffset(a, b) {
  if (a.getBoundingClientRect().top < b.getBoundingClientRect().top) return -1
  if (a.getBoundingClientRect().top > b.getBoundingClientRect().top) return 1
  return 0
}
