
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-indexof/index.js", Function("exports, require, module",
"\nvar indexOf = [].indexOf;\n\nmodule.exports = function(arr, obj){\n  if (indexOf) return arr.indexOf(obj);\n  for (var i = 0; i < arr.length; ++i) {\n    if (arr[i] === obj) return i;\n  }\n  return -1;\n};//@ sourceURL=component-indexof/index.js"
));
require.register("component-emitter/index.js", Function("exports, require, module",
"\n/**\n * Module dependencies.\n */\n\nvar index = require('indexof');\n\n/**\n * Expose `Emitter`.\n */\n\nmodule.exports = Emitter;\n\n/**\n * Initialize a new `Emitter`.\n *\n * @api public\n */\n\nfunction Emitter(obj) {\n  if (obj) return mixin(obj);\n};\n\n/**\n * Mixin the emitter properties.\n *\n * @param {Object} obj\n * @return {Object}\n * @api private\n */\n\nfunction mixin(obj) {\n  for (var key in Emitter.prototype) {\n    obj[key] = Emitter.prototype[key];\n  }\n  return obj;\n}\n\n/**\n * Listen on the given `event` with `fn`.\n *\n * @param {String} event\n * @param {Function} fn\n * @return {Emitter}\n * @api public\n */\n\nEmitter.prototype.on = function(event, fn){\n  this._callbacks = this._callbacks || {};\n  (this._callbacks[event] = this._callbacks[event] || [])\n    .push(fn);\n  return this;\n};\n\n/**\n * Adds an `event` listener that will be invoked a single\n * time then automatically removed.\n *\n * @param {String} event\n * @param {Function} fn\n * @return {Emitter}\n * @api public\n */\n\nEmitter.prototype.once = function(event, fn){\n  var self = this;\n  this._callbacks = this._callbacks || {};\n\n  function on() {\n    self.off(event, on);\n    fn.apply(this, arguments);\n  }\n\n  fn._off = on;\n  this.on(event, on);\n  return this;\n};\n\n/**\n * Remove the given callback for `event` or all\n * registered callbacks.\n *\n * @param {String} event\n * @param {Function} fn\n * @return {Emitter}\n * @api public\n */\n\nEmitter.prototype.off =\nEmitter.prototype.removeListener =\nEmitter.prototype.removeAllListeners = function(event, fn){\n  this._callbacks = this._callbacks || {};\n\n  // all\n  if (0 == arguments.length) {\n    this._callbacks = {};\n    return this;\n  }\n\n  // specific event\n  var callbacks = this._callbacks[event];\n  if (!callbacks) return this;\n\n  // remove all handlers\n  if (1 == arguments.length) {\n    delete this._callbacks[event];\n    return this;\n  }\n\n  // remove specific handler\n  var i = index(callbacks, fn._off || fn);\n  if (~i) callbacks.splice(i, 1);\n  return this;\n};\n\n/**\n * Emit `event` with the given args.\n *\n * @param {String} event\n * @param {Mixed} ...\n * @return {Emitter}\n */\n\nEmitter.prototype.emit = function(event){\n  this._callbacks = this._callbacks || {};\n  var args = [].slice.call(arguments, 1)\n    , callbacks = this._callbacks[event];\n\n  if (callbacks) {\n    callbacks = callbacks.slice(0);\n    for (var i = 0, len = callbacks.length; i < len; ++i) {\n      callbacks[i].apply(this, args);\n    }\n  }\n\n  return this;\n};\n\n/**\n * Return array of callbacks for `event`.\n *\n * @param {String} event\n * @return {Array}\n * @api public\n */\n\nEmitter.prototype.listeners = function(event){\n  this._callbacks = this._callbacks || {};\n  return this._callbacks[event] || [];\n};\n\n/**\n * Check if this emitter has `event` handlers.\n *\n * @param {String} event\n * @return {Boolean}\n * @api public\n */\n\nEmitter.prototype.hasListeners = function(event){\n  return !! this.listeners(event).length;\n};\n//@ sourceURL=component-emitter/index.js"
));
require.register("timoxley-throttle/index.js", Function("exports, require, module",
"/**\n * Module exports\n */\nmodule.exports = throttle\nmodule.exports.debounce = debounce\n\n/**\n * Returns a function, that, when invoked, will only be triggered at most once during a given window of time.\n *\n * @param {Number} func target function to invoke.\n * @param {Number} wait milliseconds to wait before allowing another invokation.\n * @return {Function} Throttled function.\n * @api public\n */\nfunction throttle(wait, func) {\n  var context, args, timeout, throttling, more, result;\n  var whenDone = debounce(wait, function(){ more = throttling = false; });\n  return function() {\n    context = this; args = arguments;\n    var later = function() {\n      timeout = null;\n      if (more) {\n        result = func.apply(context, args);\n      }\n      whenDone();\n    };\n    if (!timeout) timeout = setTimeout(later, wait);\n    if (throttling) {\n      more = true;\n    } else {\n      throttling = true;\n      result = func.apply(context, args);\n    }\n    whenDone();\n    return result;\n  };\n};\n\n/**\n * Returns a function, that, as long as it continues to be invoked, will not be triggered. The function will be called after it stops being called for `wait` milliseconds.\n *\n * @param {Number} func target function to invoke.\n * @param {Number} wait milliseconds to wait before allowing another invokation.\n * @param {Boolean} immediate trigger the function on the leading edge, instead of the trailing.\n * @return {Function} Throttled function.\n * @api public\n */\nfunction debounce(wait, func, immediate) {\n  var timeout, result;\n  return function() {\n    var context = this, args = arguments;\n    var later = function() {\n      timeout = null;\n      if (!immediate) result = func.apply(context, args);\n    };\n    var callNow = immediate && !timeout;\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n    if (callNow) result = func.apply(context, args);\n    return result;\n  };\n};\n//@ sourceURL=timoxley-throttle/index.js"
));
require.register("component-domify/index.js", Function("exports, require, module",
"\n/**\n * Expose `parse`.\n */\n\nmodule.exports = parse;\n\n/**\n * Wrap map from jquery.\n */\n\nvar map = {\n  option: [1, '<select multiple=\"multiple\">', '</select>'],\n  optgroup: [1, '<select multiple=\"multiple\">', '</select>'],\n  legend: [1, '<fieldset>', '</fieldset>'],\n  thead: [1, '<table>', '</table>'],\n  tbody: [1, '<table>', '</table>'],\n  tfoot: [1, '<table>', '</table>'],\n  colgroup: [1, '<table>', '</table>'],\n  caption: [1, '<table>', '</table>'],\n  tr: [2, '<table><tbody>', '</tbody></table>'],\n  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],\n  th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],\n  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],\n  _default: [0, '', '']\n};\n\n/**\n * Parse `html` and return the children.\n *\n * @param {String} html\n * @return {Array}\n * @api private\n */\n\nfunction parse(html) {\n  if ('string' != typeof html) throw new TypeError('String expected');\n  \n  // tag name\n  var m = /<([\\w:]+)/.exec(html);\n  if (!m) throw new Error('No elements were generated.');\n  var tag = m[1];\n  \n  // body support\n  if (tag == 'body') {\n    var el = document.createElement('html');\n    el.innerHTML = html;\n    return [el.removeChild(el.lastChild)];\n  }\n  \n  // wrap map\n  var wrap = map[tag] || map._default;\n  var depth = wrap[0];\n  var prefix = wrap[1];\n  var suffix = wrap[2];\n  var el = document.createElement('div');\n  el.innerHTML = prefix + html + suffix;\n  while (depth--) el = el.lastChild;\n\n  return orphan(el.children);\n}\n\n/**\n * Orphan `els` and return an array.\n *\n * @param {NodeList} els\n * @return {Array}\n * @api private\n */\n\nfunction orphan(els) {\n  var ret = [];\n\n  while (els.length) {\n    ret.push(els[0].parentNode.removeChild(els[0]));\n  }\n\n  return ret;\n}\n//@ sourceURL=component-domify/index.js"
));
require.register("component-classes/index.js", Function("exports, require, module",
"\n/**\n * Module dependencies.\n */\n\nvar index = require('indexof');\n\n/**\n * Whitespace regexp.\n */\n\nvar re = /\\s+/;\n\n/**\n * toString reference.\n */\n\nvar toString = Object.prototype.toString;\n\n/**\n * Wrap `el` in a `ClassList`.\n *\n * @param {Element} el\n * @return {ClassList}\n * @api public\n */\n\nmodule.exports = function(el){\n  return new ClassList(el);\n};\n\n/**\n * Initialize a new ClassList for `el`.\n *\n * @param {Element} el\n * @api private\n */\n\nfunction ClassList(el) {\n  this.el = el;\n  this.list = el.classList;\n}\n\n/**\n * Add class `name` if not already present.\n *\n * @param {String} name\n * @return {ClassList}\n * @api public\n */\n\nClassList.prototype.add = function(name){\n  // classList\n  if (this.list) {\n    this.list.add(name);\n    return this;\n  }\n\n  // fallback\n  var arr = this.array();\n  var i = index(arr, name);\n  if (!~i) arr.push(name);\n  this.el.className = arr.join(' ');\n  return this;\n};\n\n/**\n * Remove class `name` when present, or\n * pass a regular expression to remove\n * any which match.\n *\n * @param {String|RegExp} name\n * @return {ClassList}\n * @api public\n */\n\nClassList.prototype.remove = function(name){\n  if ('[object RegExp]' == toString.call(name)) {\n    return this.removeMatching(name);\n  }\n\n  // classList\n  if (this.list) {\n    this.list.remove(name);\n    return this;\n  }\n\n  // fallback\n  var arr = this.array();\n  var i = index(arr, name);\n  if (~i) arr.splice(i, 1);\n  this.el.className = arr.join(' ');\n  return this;\n};\n\n/**\n * Remove all classes matching `re`.\n *\n * @param {RegExp} re\n * @return {ClassList}\n * @api private\n */\n\nClassList.prototype.removeMatching = function(re){\n  var arr = this.array();\n  for (var i = 0; i < arr.length; i++) {\n    if (re.test(arr[i])) {\n      this.remove(arr[i]);\n    }\n  }\n  return this;\n};\n\n/**\n * Toggle class `name`.\n *\n * @param {String} name\n * @return {ClassList}\n * @api public\n */\n\nClassList.prototype.toggle = function(name){\n  // classList\n  if (this.list) {\n    this.list.toggle(name);\n    return this;\n  }\n\n  // fallback\n  if (this.has(name)) {\n    this.remove(name);\n  } else {\n    this.add(name);\n  }\n  return this;\n};\n\n/**\n * Return an array of classes.\n *\n * @return {Array}\n * @api public\n */\n\nClassList.prototype.array = function(){\n  var arr = this.el.className.split(re);\n  if ('' === arr[0]) arr.pop();\n  return arr;\n};\n\n/**\n * Check if class `name` is present.\n *\n * @param {String} name\n * @return {ClassList}\n * @api public\n */\n\nClassList.prototype.has =\nClassList.prototype.contains = function(name){\n  return this.list\n    ? this.list.contains(name)\n    : !! ~index(this.array(), name);\n};\n//@ sourceURL=component-classes/index.js"
));
require.register("component-inherit/index.js", Function("exports, require, module",
"\nmodule.exports = function(a, b){\n  var fn = function(){};\n  fn.prototype = b.prototype;\n  a.prototype = new fn;\n  a.prototype.constructor = a;\n};//@ sourceURL=component-inherit/index.js"
));
require.register("timoxley-assert/index.js", Function("exports, require, module",
"// http://wiki.commonjs.org/wiki/Unit_Testing/1.0\n//\n// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!\n//\n// Originally from narwhal.js (http://narwhaljs.org)\n// Copyright (c) 2009 Thomas Robinson <280north.com>\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the 'Software'), to\n// deal in the Software without restriction, including without limitation the\n// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or\n// sell copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN\n// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION\n// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n\n// Adapted for browser components by Tim Oxley\n// from https://github.com/joyent/node/blob/72bc4dcda4cfa99ed064419e40d104bd1b2e0e25/lib/assert.js\n\n// UTILITY\nvar inherit = require('inherit');\nvar pSlice = Array.prototype.slice;\n\n// 1. The assert module provides functions that throw\n// AssertionError's when particular conditions are not met. The\n// assert module must conform to the following interface.\n\nvar assert = module.exports = ok;\n\n// 2. The AssertionError is defined in assert.\n// new assert.AssertionError({ message: message,\n//                             actual: actual,\n//                             expected: expected })\n\nassert.AssertionError = function AssertionError(options) {\n  this.name = 'AssertionError';\n  this.message = options.message;\n  this.actual = options.actual;\n  this.expected = options.expected;\n  this.operator = options.operator;\n  var stackStartFunction = options.stackStartFunction || fail;\n\n  if (Error.captureStackTrace) {\n    Error.captureStackTrace(this, stackStartFunction);\n  }\n};\n\n// assert.AssertionError instanceof Error\ninherit(assert.AssertionError, Error);\n\nfunction replacer(key, value) {\n  if (value === undefined) {\n    return '' + value;\n  }\n  if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {\n    return value.toString();\n  }\n  if (typeof value === 'function' || value instanceof RegExp) {\n    return value.toString();\n  }\n  return value;\n}\n\nfunction truncate(s, n) {\n  if (typeof s == 'string') {\n    return s.length < n ? s : s.slice(0, n);\n  } else {\n    return s;\n  }\n}\n\nassert.AssertionError.prototype.toString = function() {\n  if (this.message) {\n    return [this.name + ':', this.message].join(' ');\n  } else {\n    return [\n      this.name + ':',\n      truncate(JSON.stringify(this.actual, replacer), 128),\n      this.operator,\n      truncate(JSON.stringify(this.expected, replacer), 128)\n    ].join(' ');\n  }\n};\n\n// At present only the three keys mentioned above are used and\n// understood by the spec. Implementations or sub modules can pass\n// other keys to the AssertionError's constructor - they will be\n// ignored.\n\n// 3. All of the following functions must throw an AssertionError\n// when a corresponding condition is not met, with a message that\n// may be undefined if not provided.  All assertion methods provide\n// both the actual and expected values to the assertion error for\n// display purposes.\n\nfunction fail(actual, expected, message, operator, stackStartFunction) {\n  throw new assert.AssertionError({\n    message: message,\n    actual: actual,\n    expected: expected,\n    operator: operator,\n    stackStartFunction: stackStartFunction\n  });\n}\n\n// EXTENSION! allows for well behaved errors defined elsewhere.\nassert.fail = fail;\n\n// 4. Pure assertion tests whether a value is truthy, as determined\n// by !!guard.\n// assert.ok(guard, message_opt);\n// This statement is equivalent to assert.equal(true, !!guard,\n// message_opt);. To test strictly for the value true, use\n// assert.strictEqual(true, guard, message_opt);.\n\nfunction ok(value, message) {\n  if (!!!value) fail(value, true, message, '==', assert.ok);\n}\nassert.ok = ok;\n\n// 5. The equality assertion tests shallow, coercive equality with\n// ==.\n// assert.equal(actual, expected, message_opt);\n\nassert.equal = function equal(actual, expected, message) {\n  if (actual != expected) fail(actual, expected, message, '==', assert.equal);\n};\n\n// 6. The non-equality assertion tests for whether two objects are not equal\n// with != assert.notEqual(actual, expected, message_opt);\n\nassert.notEqual = function notEqual(actual, expected, message) {\n  if (actual == expected) {\n    fail(actual, expected, message, '!=', assert.notEqual);\n  }\n};\n\n// 7. The equivalence assertion tests a deep equality relation.\n// assert.deepEqual(actual, expected, message_opt);\n\nassert.deepEqual = function deepEqual(actual, expected, message) {\n  if (!_deepEqual(actual, expected)) {\n    fail(actual, expected, message, 'deepEqual', assert.deepEqual);\n  }\n};\n\nfunction _deepEqual(actual, expected) {\n  // 7.1. All identical values are equivalent, as determined by ===.\n  if (actual === expected) {\n    return true;\n\n  // 7.2. If the expected value is a Date object, the actual value is\n  // equivalent if it is also a Date object that refers to the same time.\n  } else if (actual instanceof Date && expected instanceof Date) {\n    return actual.getTime() === expected.getTime();\n\n  // 7.3 If the expected value is a RegExp object, the actual value is\n  // equivalent if it is also a RegExp object with the same source and\n  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).\n  } else if (actual instanceof RegExp && expected instanceof RegExp) {\n    return actual.source === expected.source &&\n           actual.global === expected.global &&\n           actual.multiline === expected.multiline &&\n           actual.lastIndex === expected.lastIndex &&\n           actual.ignoreCase === expected.ignoreCase;\n\n  // 7.4. Other pairs that do not both pass typeof value == 'object',\n  // equivalence is determined by ==.\n  } else if (typeof actual != 'object' && typeof expected != 'object') {\n    return actual == expected;\n\n  // 7.5 For all other Object pairs, including Array objects, equivalence is\n  // determined by having the same number of owned properties (as verified\n  // with Object.prototype.hasOwnProperty.call), the same set of keys\n  // (although not necessarily the same order), equivalent values for every\n  // corresponding key, and an identical 'prototype' property. Note: this\n  // accounts for both named and indexed properties on Arrays.\n  } else {\n    return objEquiv(actual, expected);\n  }\n}\n\nfunction isUndefinedOrNull(value) {\n  return value === null || value === undefined;\n}\n\nfunction isArguments(object) {\n  return Object.prototype.toString.call(object) == '[object Arguments]';\n}\n\nfunction objEquiv(a, b) {\n  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))\n    return false;\n  // an identical 'prototype' property.\n  if (a.prototype !== b.prototype) return false;\n  //~~~I've managed to break Object.keys through screwy arguments passing.\n  //   Converting to array solves the problem.\n  if (isArguments(a)) {\n    if (!isArguments(b)) {\n      return false;\n    }\n    a = pSlice.call(a);\n    b = pSlice.call(b);\n    return _deepEqual(a, b);\n  }\n  try {\n    var ka = Object.keys(a),\n        kb = Object.keys(b),\n        key, i;\n  } catch (e) {//happens when one is a string literal and the other isn't\n    return false;\n  }\n  // having the same number of owned properties (keys incorporates\n  // hasOwnProperty)\n  if (ka.length != kb.length)\n    return false;\n  //the same set of keys (although not necessarily the same order),\n  ka.sort();\n  kb.sort();\n  //~~~cheap key test\n  for (i = ka.length - 1; i >= 0; i--) {\n    if (ka[i] != kb[i])\n      return false;\n  }\n  //equivalent values for every corresponding key, and\n  //~~~possibly expensive deep test\n  for (i = ka.length - 1; i >= 0; i--) {\n    key = ka[i];\n    if (!_deepEqual(a[key], b[key])) return false;\n  }\n  return true;\n}\n\n// 8. The non-equivalence assertion tests for any deep inequality.\n// assert.notDeepEqual(actual, expected, message_opt);\n\nassert.notDeepEqual = function notDeepEqual(actual, expected, message) {\n  if (_deepEqual(actual, expected)) {\n    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);\n  }\n};\n\n// 9. The strict equality assertion tests strict equality, as determined by ===.\n// assert.strictEqual(actual, expected, message_opt);\n\nassert.strictEqual = function strictEqual(actual, expected, message) {\n  if (actual !== expected) {\n    fail(actual, expected, message, '===', assert.strictEqual);\n  }\n};\n\n// 10. The strict non-equality assertion tests for strict inequality, as\n// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);\n\nassert.notStrictEqual = function notStrictEqual(actual, expected, message) {\n  if (actual === expected) {\n    fail(actual, expected, message, '!==', assert.notStrictEqual);\n  }\n};\n\nfunction expectedException(actual, expected) {\n  if (!actual || !expected) {\n    return false;\n  }\n\n  if (expected instanceof RegExp) {\n    return expected.test(actual);\n  } else if (actual instanceof expected) {\n    return true;\n  } else if (expected.call({}, actual) === true) {\n    return true;\n  }\n\n  return false;\n}\n\nfunction _throws(shouldThrow, block, expected, message) {\n  var actual;\n\n  if (typeof expected === 'string') {\n    message = expected;\n    expected = null;\n  }\n\n  try {\n    block();\n  } catch (e) {\n    actual = e;\n  }\n\n  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +\n            (message ? ' ' + message : '.');\n\n  if (shouldThrow && !actual) {\n    fail(actual, expected, 'Missing expected exception' + message);\n  }\n\n  if (!shouldThrow && expectedException(actual, expected)) {\n    fail(actual, expected, 'Got unwanted exception' + message);\n  }\n\n  if ((shouldThrow && actual && expected &&\n      !expectedException(actual, expected)) || (!shouldThrow && actual)) {\n    throw actual;\n  }\n}\n\n// 11. Expected to throw an error:\n// assert.throws(block, Error_opt, message_opt);\n\nassert.throws = function(block, /*optional*/error, /*optional*/message) {\n  _throws.apply(this, [true].concat(pSlice.call(arguments)));\n};\n\n// EXTENSION! This is annoying to write outside this module.\nassert.doesNotThrow = function(block, /*optional*/message) {\n  _throws.apply(this, [false].concat(pSlice.call(arguments)));\n};\n\nassert.ifError = function(err) { if (err) {throw err;}};\n//@ sourceURL=timoxley-assert/index.js"
));
require.register("scroll-position/index.js", Function("exports, require, module",
"/**\n * Module dependencies.\n */\n\nvar Emitter = require('emitter')\nvar throttle = require('throttle')\n\nvar toArray = Array.prototype.slice.call.bind(Array.prototype.slice)\n\n/**\n * ScrollPosition factory\n *\n * @param {Array.<HTMLElement>} nodes\n * @return {ScrollPosition}\n * @api public\n */\n\nmodule.exports = function(nodes, options) {\n  return new ScrollPosition(nodes, options)\n}\n\n/**\n * Initialise a new `ScrollPosition`\n *\n * @api public\n */\n\nfunction ScrollPosition(nodes, options) {\n  options = options || {}\n\tnodes = nodes || []\n\n  // convert NodeLists etc into arrays\n  nodes = toArray(nodes)\n\n  this.offsetOut = options.offsetOut || 100\n  this.offsetIn = options.offsetIn || 0\n\n  // throttle scroll events\n  options.throttle = options.throttle !== undefined\n    ? options.throttle\n    : 20\n\n  this.root = window\n  this.nodes = nodes.sort(sortByOffset)\n\n  this.root.addEventListener('scroll', throttle(options.throttle, this.onScroll.bind(this)))\n  this.onScroll() // trigger once to initialise\n}\n\nEmitter(ScrollPosition.prototype)\n\n/**\n * Scroll event handler. Fires `scrollOut` events.\n *\n * @api private\n */\n\nScrollPosition.prototype.onScroll = function onScroll() {\n  var nodes = this.nodes\n  var offsetOut = this.offsetOut\n  var offsetIn = this.offsetIn\n\n  // initialize oldScroll\n  var oldScroll = this.oldScroll = (this.oldScroll === undefined) ? this.root.scrollY : this.oldScroll\n\n  var newScroll = this.root.scrollY\n  // how much we scrolled between last event and this event\n  var scrollDelta = oldScroll - newScroll\n  // figure out which nodes scrolled in or out\n  var scrolledOut = nodes\n    .filter(isScrolledOut.bind(null, offsetOut, scrollDelta))\n  var scrolledIn = nodes.slice().reverse()\n    .filter(isScrolledIn.bind(null, offsetIn, scrollDelta))\n\n  // fire scrollOut events\n  scrolledOut\n    .map(this.emit.bind(this, 'out'))\n    .map(this.emit.bind(this, 'scrollOut'))\n\n  // fire scrollIn events\n  scrolledIn\n    .map(this.emit.bind(this, 'in'))\n    .map(this.emit.bind(this, 'scrollIn'))\n\n  // fire scrollInOut events for both\n  scrolledOut\n    .concat(scrolledIn)\n    .map(this.emit.bind(this, 'inOut'))\n    .map(this.emit.bind(this, 'scrollInOut'))\n\n  this.oldScroll = newScroll\n}\n\n/**\n * True if a node has been scrolled out.\n *\n * @param {Number} baseOffset Base offset for detecting scroll changes\n * @param {Number} scrollDelta Scroll difference\n * @param {HTMLElement} node\n * @return {Boolean} true of element was scrolled out\n * @api private\n */\n\nfunction isScrolledOut(baseOffset, scrollDelta, node) {\n  var offsetTop = node.getBoundingClientRect().top\n  var previous = offsetTop - scrollDelta\n  // if previously was scrolled in\n  if (previous >= baseOffset) {\n    // and falls below offset threshold\n    return (offsetTop < baseOffset)\n  }\n  return false\n}\n\n/**\n * True if a node has been scrolled in.\n *\n * @param {Number} baseOffset Base offset for detecting scroll changes\n * @param {Number} scrollDelta Scroll difference\n * @param {HTMLElement} node\n * @return {Boolean} true of element was scrolled in\n * @api private\n */\n\nfunction isScrolledIn(baseOffset, scrollDelta, node) {\n  var offsetTop = node.getBoundingClientRect().top\n  var previous = offsetTop - scrollDelta\n  // if previously was scrolled out\n  if (previous <= baseOffset) {\n    // and falls beyond offset threshold\n    return (offsetTop >= baseOffset)\n  }\n  return false\n\n}\n\n/**\n * Function for sorting an array of HTMLElements by their offset.\n *\n * @api private\n */\n\nfunction sortByOffset(a, b) {\n  if (a.getBoundingClientRect().top < b.getBoundingClientRect().top) return -1\n  if (a.getBoundingClientRect().top > b.getBoundingClientRect().top) return 1\n  return 0\n}\n//@ sourceURL=scroll-position/index.js"
));
require.alias("component-emitter/index.js", "scroll-position/deps/emitter/index.js");
require.alias("component-emitter/index.js", "emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("timoxley-throttle/index.js", "scroll-position/deps/throttle/index.js");
require.alias("timoxley-throttle/index.js", "throttle/index.js");

require.alias("component-domify/index.js", "scroll-position/deps/domify/index.js");
require.alias("component-domify/index.js", "domify/index.js");

require.alias("component-classes/index.js", "scroll-position/deps/classes/index.js");
require.alias("component-classes/index.js", "classes/index.js");
require.alias("component-indexof/index.js", "component-classes/deps/indexof/index.js");

require.alias("timoxley-assert/index.js", "scroll-position/deps/assert/index.js");
require.alias("timoxley-assert/index.js", "assert/index.js");
require.alias("component-inherit/index.js", "timoxley-assert/deps/inherit/index.js");

