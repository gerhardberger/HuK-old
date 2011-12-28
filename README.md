HuK
-----
HuK.js is a library for generating HTML code in JavaScript. It will be an [Ender.js](https://github.com/ded/Ender.js) module and it uses some basic modules ([bonzo](https://github.com/ded/bonzo), [bean](https://github.com/fat/bean)). Or you can simply use it with [jQuery](https://github.com/jquery/jquery).

<h2>Example</h2>

``` js
HuK('.foo')
	.h1('Title')
	.div({
		class: 'klass',
		content: 'Text'
	})
	.textarea()
	.button({
		id: 'bar',
		content: 'Click!',
		click: function(arg) {
			console.log($('textarea').val())
		}
	})
.append()
```

<h3>HuK()</h3>

You pass the selector name in and in the end you can do `.append()`, `.prepend()`, `.html()`, `.text()`, `.before()`, `.after()`.

<h3>Functions</h3>

HuK (hopefully) supports all the existing HTML elements. That means, to create a `<div>` element, you can:

* .div() - `<div></div>`
* .div(String) - `<div>String</div>`
* .div({id: 'foo', class: 'bar', content: 'Content'}) - `<div id="foo" class="bar">Content</div>`

<h4>Events</h4>

The events in [bean](https://github.com/fat/bean) can be written here too.

``` js
	HuK('.foo')
		.div({
			content: 'Text',
			hover: function() {
				alert('bar')
			},
			click: function() {
				console.log('Hello')
			}
		})
	.html()
```

<h3>Special functions</h3>

<h4>.list()</h4>

This function creates an HTML list (`<ul><li></li>...</ul>`) and you can use an array (what you may want to fill it) and it creates the whole list. If you want to refer to the value to the array put there `<<value>>` in the string (or `<<value.etwas>>` if it is an object). You can refer to the current index with `<<index>>`.

* `items` - the items of the list (array or if it is a number it makes that many empty items)
* `itemArgs` - object, here comes the items' arguments
* `justItems` - true, or false; if false it makes the list without the `<ul>`

``` js
	var arr = ['MC', 'Nestea', 'Hero']
	HuK('#foo')
		.list({
			items: arr,
			class: 'players',
			itemArgs: {
				id: '<<index>>',
				content: '<<value>>'
			}
		})
	.text()
```

<h4>.Table()</h4>

This creates a table from `<div>`s, similar to `.list()`. To refer to the two indexes, use `<<index>>`, `<<index2>>`.

* `items` - the items of the table (array or if it is a number it makes that many empty items)
* `row` - number of rows
* `col` - number of columns

``` js
	HuK('#foo')
		.Table({
			row: 5,
			col: 4,
			itemArgs: {
				id: '<<index>>_<<index2>>'
			}
		})
	.prepend()
```