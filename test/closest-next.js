var closestNext = require('scroll-position')._closestNext
var assert = require('timoxley-assert')

describe('closest next', function() {
	it('0,0', function() {
		assert.strictEqual(closestNext(0, [0]), 0)
	})
	it('0 + number', function() {
		assert.strictEqual(closestNext(0, [10]), 10)
	})
	it('0 + numbers', function() {
		assert.strictEqual(closestNext(0, [10, 20]), 10)
	})
})
