<h1>HuK</h1>

HuK.js is a library for generating HTML code written in JavaScript. It is an [Ender.js](https://github.com/ded/Ender.js) module and it uses some basic modules ([bonzo](https://github.com/ded/bonzo), [bean](https://github.com/fat/bean)). Or you can simply use it with [jQuery](https://github.com/jquery/jquery).

<h2>Example</h2>

``` js
HuK('.foo')
	.h1('Title')
	.div({
		class: 'klass'
		, content: 'Text'
	})
	.textarea()
	.button({
		id: 'bar'
		, content: 'Click!'
		, click: function(arg) {
			console.log($('textarea').val())
		}
	})
.append()
```

<h2>HuK function</h2>

You pass the selector name in and in the end you can do `.append()`, `.prepend()`, `.html()`, `.text()`, `.before()`, `.after()`.

<h2>Functions</h2>

HuK (hopefully) supports all the existing HTML elements. That means, to create a `<div>` element, you can:

* .div() - `<div></div>`
* .div(String) - `<div>String</div>`
* .div({id: 'foo', class: 'bar', content: 'Content'}) - `<div id="foo" class="bar">Content</div>`

<h2>Events</h2>

The events in [bean](https://github.com/fat/bean) can be written here too.

``` js
	HuK('.foo')
		.div({
			content: 'Text'
			, data: 'Some variable'
			, hover: function() {
				alert('bar')
			}
			, click: function() {
				console.log(this.data)
			}
		})
	.html()
```

If you want to access some data in the event function, you can pass it in the `data` field. Then in the `this` variable in the event will be an object like this:

``` js
	this = {
		data: 'foo', // the data field's value
		path: '.bar' // The path to the element
	}
```

<h2>Special functions</h2>

<h3>.list()</h3>

This function creates an HTML list (`<ul><li></li>...</ul>`) and you can use an array (what you may want to fill it) and it creates the whole list. If you want to refer to the value to the array put there `<<value>>` in the string (or `<<value.etwas>>` if it is an object). You can refer to the current index with `<<index>>`.

* `items`     - the items of the list (array or if it is a number it makes that many empty items)
* `itemArgs`  - object, here comes the items' arguments
* `justItems` - true, or false; if false it makes the list without the `<ul>`
* `itemTag`   - changes the item's HTML tag

You can access the current value, index of the list and the path in the <i>this</i> variable in the event functions too.

``` js
	var arr = ['MC', 'Nestea', 'Hero']
	HuK('#foo')
		.list({
			items: arr
			, class: 'players'
			, itemArgs: {
				id: '<<index>>'
				, content: '<<value>>'
			}
			, click: function() {
				console.log(this.data+this.i) // Current value of the list and the current index
				console.log(this.path)       // Current path (here: #foo ul li)
			}
		})
	.text()
```

You can make a list from tags other than `<li>`:

``` js
	HuK('#foo')
		.list({
			items: names
			, itemTag: 'button'
			, content: 'Click this, <<value>>!'
		})
	.append()
```

<h3>.Table()</h3>

This creates a table from `<div>`s, similar to `.list()`. To refer to the two indexes, use `<<index>>`, `<<index2>>`.

* `items` - the items of the table (array or if it is a number it makes that many empty items)
* `row` - number of rows
* `col` - number of columns

``` js
	HuK('#foo')
		.Table({
			row: 5
			, col: 4
			, itemArgs: {
				id: '<<index>>_<<index2>>'
			}
		})
	.prepend()
```

<h2>Nesting</h2>

If you want to nest some content, you have use the `.value()` function in the end, instead of `.html()`, `.append()` etc.

``` js
	HuK('#foo')
		.div({
			content: HuK()
				.h1('Title1')
				.h2('Title2')
				.h3({
					content: HuK()
						.span('Title3')
						.span('Title4')
					.value()
				})
			.value()
		})
	.text()
```

But if you do not chain functions when nesting, you can also write the nested element simpler like this:

``` js
	HuK('#bar')
		div({
			content: HuK.a({
				href: 'url'
				, content: 'link'
			})
		})
```

<h2>Working with Twitter Bootstrap</h2>

HuK.js supports [Twitter Bootstrap](http://twitter.github.com/bootstrap), but you have to download the jQuery plugin yourself, it is not included. So you can write the following code:

``` js
	HuK('body')
		.div({
			class: 'btn-group',
			content: HuK().a({
					class: 'btn dropdown-toggle'
					, 'data-toggle': 'dropdown'
					, href: '#'
					, content: 'Action <span class="caret"></span>'
				})
				.list({
					items: arr
					, class: 'dropdown-menu'
					, content:
						HuK.a({
							rel: 'tooltip'
							, title: '<<index>>'
							, tooltip: {
								placement: 'bottom'
							}
							, content: '<<value>>'
						})
				}).value()
		})
	.html()
```

Note: If you call the Bootstrap function empty, set it true (e.g. {tooltip: true}).

<h2>.addTag</h2>

You can add new HTML tags to HuK.js:

``` js
	HuK.addTag('newtag')
```

<h2>Using Ender</h2>

You can use HuK.js as an ender module:

```
	ender build HuK
```

And write the code like so:

``` js
	$.huk('.foo')
		.list({
			items: list
			, content: $.huk.a('Test')
		})
		.span('Text')
	.append()
```