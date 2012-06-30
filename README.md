<h1>HuK</h1>

huk.js is a library for generating HTML code written in JavaScript. It is using some basic [jQuery](https://github.com/jquery/jquery) stuff.

<h2>Example</h2>

``` js
huk('.foo')
	.h1('Title')
	.div({
		id: 'bar'
		, class: 'klass'
		, content: huk.strong('Text')
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
* `.div(DOMElement)` - `<div>DOMElement</div>`
* `.div({id: 'foo', class: 'bar', content: 'Content'})` - `<div id="foo" class="bar">Content</div>`
* `.img(Url)` - `<img src="Url" />`

<h3>.addTag(name)</h3>

You can add new HTML tags:

``` js
	huk.addTag('newtag')
```

<h2>Events</h2>

The events in [jQuery](https://github.com/jquery/jquery) can be written here too.

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


<h2>.list(options)</h2>

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

You can manipulate the list with a couple of functions: `head`, `last`, `rest`, `initial`.

``` js
	huk('body')
		.list({
			items: ['Group A', 'Stephano', 'HuK', 'Idra']
			, justItems: true
			, itemArgs: {
				content: '<<value>>'
				, head: function(elem) {
					$(this).html(huk.b(elem))
				}
				, rest: function(elem) {
					$(this).prepend('Name: ')
				}
			}
		})
	.html()
```
Which results:
``` html
	<li><b>Group A</b></li>
	<li>Name: Stephano</li>
	<li>Name: HuK</li>
	<li>Name: Idra</li>
```


<h2>Nesting</h2>

The single and chained nesting options both just return normal DOM nodes, so you can use them elsewhere in your program, or you can nest elements not created with these functions.

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


<h2>.bundle(name, fn)</h2>

You can create bundles and name them, thus your code will be simpler and easier to read. This way you can focus in your code to the part which matters. You can re-use this way a bundle of HTML much more easily.

<h4>Create bundle</h4>

In the `.bundle()` function the firts parameter is the name of the bundle. The second is a function, which has to return some kind of DOM element.

``` js
	huk.bundle('tweet', function(data) {
		var name = '@' + data.author
			, text = data.tweetText
			, date = data.date

		return huk.div({
			class: 'tweet'
			, content: huk()
				.strong(name)
				.p(text)
				.small(date)
			.val()
		})
	})
```

<h4>Call a bundle</h4>

When you created a bundle, you can use it just as a normal HTML tag in `huk`. You can pass in two parameters, the first is something you want to use in the bundle's function, the second is either a Boolean or a String. If it is a Boolean and `True`, then it assumes, that the first parameter is an array and it is going to call the bundle function for each of the element in the array (this way easier to handle a list). If it is a String, then it does the same thing, but the elements of the list will not be `li`s but the passed in String.

``` js
	huk('.foo')
		.tweet({author: 'Horse_ebooks', tweetText: 'Roses Perfectly', date: '10:33 AM - 29 Jun 12'})
	.html()
```

Result: 

``` html
	<div class="tweet">
		<strong>@Horse_ebooks</strong>
		<p>Roses Perfectly</p>
		<small>10:33 AM - 29 Jun 12</small>
	</div>
```

<h4>Bundles on lists</h4>

``` js
	huk.bundle('profile', function(data) {
		return huk()
			.strong(data.name)
			.i(data.age)
		.val()
	})

	var arr = [{name: 'Anthony', age: 49}, {name 'Flea', age: 49}, {name: 'Chad', age: 50}]

	huk('.bar').profile(arr, 'div').append()
```

Result:

``` html
	<div>
		<strong>Anthony</strong>
		<i>49</i>
	</div>
	<div>
		<strong>Flea</strong>
		<i>49</i>
	</div>
	<div>
		<strong>Chad</strong>
		<i>50</i>
	</div>
```