jQuery.sticky
=============

jQuery.sticky provides functionality for anchoring an element to the page so
that when the user scrolls it will be kept in the window when possible.

Usage
-----

Include jquery.sticky in your HTML, e.g.

```html
<script type="text/javascript" src="jquery.sticky.js">
```

Then in in the DOM ready event handler, tell the plug-in which element(s) you
want to be sticky:

```javascript
$(function () {
    $('#navigation').sticky();
});
```

What do you mean by sticky?
---------------------------

The plugin will leave the element positioned statically until the top of window
is level with the element, then as the window scrolls down the element will be
kept level with the top until a point where scrolling would cause the element to
break out of its parent.

If that's not clear, take a look at the demos to get a feeling for what
jQuery.sticky can do for you.

Options
-------

jQuery.sticky provides a couple of options:

* parent
* gutter

The *parent* option allows you to specify a non-direct parent to use for
overflow reference. This is useful (and necessary) if you have multi-column
layout where the direct parent of the element may not have the any more height
than the element itself.

The *gutter* option allows you to specify a vertical gutter to keep the element
away from the top or bottom of the window.

For more details, see the demos.