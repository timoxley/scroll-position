# scroll-position

  Fire events when scrolling over dom elements.

## Installation

    $ component install timoxley/scroll-position

## Example

```js
// Elements we want to track
var items = document.querySelectorAll('div')

var ScrollPosition = require('scroll-position')
var itemPosition = ScrollPosition(items, {
  // Default settings
  offsetOut: 100, // y position in px where items leave the viewport
  offsetIn: 0 // y position where items enter the viewport
})

itemPosition.on('scrollOut', function(el) {
  // el was scrolled out of the top of the viewport
  console.log(el)
})
itemPosition.on('scrollIn', function(el) {
  // el was scrolled in from the top of the viewport
  console.log(el)
})
itemPosition.on('scrollInOut', function(el) {
  console.log(el) // this element was scrolled in or out of the top of the viewport
})
```

[Demo](http://timoxley.github.com/scroll-position/examples/menu)

## Events

### scrollOut
Fired whenever one of the supplied items is scrolled out the top of the viewport
e.g scrolling down, and the item goes past the top of the window.

The first arguments to the event handler is the element that was scrolled out.

### scrollIn
Fired whenever one of the supplied items is scrolled into the top of the viewport
e.g scrolling up, and the item enters the top of the window.

The first arguments to the event handler is the element that was scrolled in.

### scrollInOut

Fired whenever one of the supplied items is scrolled in or out of the top of the viewport
e.g scrolling up or down, and the item enters or leaves the top of the window.

The first arguments to the event handler is the element that was scrolled in or out.

## License

  MIT

