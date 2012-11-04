# scroll-position

  Fire events when scrolling over dom elements.

## Installation

    $ component install timoxley/scroll-position

## Example

```js
  // dom elements we want to track
  var items = document.querySelectorAll('div')

  var ScrollPosition = require('scroll-position')
  var itemPosition = ScrollPosition(items)

  itemPosition.on('scrollOut', function(el) {
    console.log(el) // this element was scrolled out of the top of the viewport
  })
  itemPosition.on('scrollIn', function(el) {
    console.log(el) // this element was scrolled in from the top of the viewport
  })
  itemPosition.on('scrollInOut', function(el) {
    console.log(el) // this element was scrolled in or out of the top of the viewport
  })
```

[Demo](http://timoxley.github.com/scroll-position)

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

