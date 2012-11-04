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
    // `scrollout` is fired whenever one of the supplied
    // items is scrolled out the top of the viewport.
    // The first argument is the element
    // that was scrolled out
    console.log(el)
  })
```

[Demo](http://timoxley.github.com/scroll-position)

## License

  MIT

