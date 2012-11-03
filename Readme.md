# scroll-position

  Fire events when scrolling over dom elements.

## Installation

    $ component install timoxley/scroll-position

## Example

```js
  // dom elements we want to track
  var items = document.querySelectorAll('.item')

  var ScrollPosition = require('scroll-position')
  var itemPosition = ScrollPosition(items)

  itemPosition.on('scrollOut', function(el) {
    // fired whenever one of the supplied items is scrolled out the top of the viewport.
    // first argument is the element that was scrolled out
  })
```

## License

  MIT
