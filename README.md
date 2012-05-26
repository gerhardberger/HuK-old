<h1>HuK</h1>

huk.js is a library for generating HTML code written in JavaScript. It is an [Ender.js](https://github.com/ded/Ender.js) module and it uses some basic modules ([bonzo](https://github.com/ded/bonzo), [bean](https://github.com/fat/bean)). Or you can simply use it with [jQuery](https://github.com/jquery/jquery).

<h2>Example</h2>

``` js
huk('.foo')
	.h1('Title')
	.div({
		id: 'bar'
		, class: 'klass'
		, content: 'Text'
	})
	.textarea()
	.img('src/img/foo.jpg')
	.button({
		content: 'Click!'
		, click: function(event) {
			console.log($('textarea').val())
		}
	})
.append()
```

<h2>huk function</h2>

You pass the selector name (or element) in and at the end you can call `.append()`, `.prepend()`, `.html()`, `.before()`, `.after()`.

It (hopefully) supports all the existing HTML elements. That means, to create a `<div>` element, you can:

* `.div()` - `<div></div>`
* `.div(String)` - `<div>String</div>`
* `.div({id: 'foo', class: 'bar', content: 'Content'})` - `<div id="foo" class="bar">Content</div>`
* `.img(Url)` - `<img src="Url" />`

<h3>.addTag</h3>

You can add new HTML tags:

``` js
	huk.addTag('newtag')
```

<h2>Events</h2>

The events in [bean](https://github.com/fat/bean) can be written here too.

``` js
	huk('.foo')
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

`click` and `hover` can be set in the usual way, but other events have to be in the `events` object:

``` js
	.a({
		content: 'dbclick'
		, events: {
			dbclick: function(event) {
				console.log(evnet)
			}
		}
	})
```

If you want to access some data in the event function, you can pass it in the `data` field. In the event call the `this` will be the particular element:

``` js
	, click: function(event, data, index) {
		$(this).append(data+' '+index)
	}		
```


<h2>.list()</h2>

This function creates an HTML list (`<ul><li></li>...</ul>`) and you can use an array and it creates a list. If you want to refer to the value to the array put there `'<<value>>'` in the string (or `'<<value.foo.bar>>'` if it is an object). You can refer to the current index with `'<<index>>'`.

* `items`     - the items of the list (array or if it is a number it makes that many empty items)
* `itemArgs`  - object, here comes the items' arguments
* `justItems` - true, or false; if false it makes the list without the `<ul>`
* `itemTag`   - changes the item's HTML tag

You can access the current value, index of the list and the path in the <i>this</i> variable in the event functions too.

``` js
	var arr = ['MC', 'Nestea', 'Hero']
	huk('#foo')
		.list({
			items: arr
			, class: 'players'
			, itemArgs: {
				id: '<<index>>'
				, content: '<<value>>'
			}
			, click: function(event, data, index) {
				console.log(this, event, data, index) // Current value of the list and the current index
			}
		})
	.text()
```

You can make a list from tags other than `<li>`:

``` js
	huk('#foo')
		.list({
			items: names
			, itemTag: 'button'
			, content: 'Click this, <<value>>!'
		})
	.append()
```

<h2>Nesting</h2>

<h4>Single element</h4>

``` js
	huk('#foo')
		.div({
			content: huk.a('bar')
		})
	.html()
```

<h4>Chained elements</h4>

If you nest multiple elements, you have to call the `.val()` function at the end of the chain.

``` js
	huk('#foo')
		.div({
			content: huk()
				.h1('Title1')
				.h2('Title2')
				.h3({
					content: huk()
						.span('Title3')
						.span('Title4')
					.val()
				})
			.val()
		})
	.text()
```

<h4>Multiple elements</h4>

``` js
	huk('#bar')
		div({
			content: ['This', huk.i('is'), huk().b('a').a('test.').val()]
		})
```


<h2>Using Ender</h2>

You can use huk.js as an ender module:

```
	ender build huk
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