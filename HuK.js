(function (name, definition) {
	if (typeof module != 'undefined') module.exports = definition();
	else if (typeof define == 'function' && define.amd) define(name, definition);
	else this[name] = definition();
})('huk', function() {

	'use strict';

	var HTMLElements = 'a area article adress abbr audio b button base bdi bdo browser center blockquote cite col'  +
										 ' colgroup command datalist details dl figure footer header hgroup map keygen kbd'   +
										 ' mark meter nav noscript object param output progress rp rt ruby section source sub'+
										 ' summary time tfoot sup track video wbr figcaption caption canvas code div dt dd'   +
										 ' em fieldset font form h1 h2 h3 h4 h5 h6 i iframe img input label li menu meta ol p'+
										 ' pre script select span small strong style table tbody td tr textarea ul hr'
		, tagWithSrc   = 'img iframe audio video'
		, insertFn     = 'append after before html text prepend'
		, mainEvents   = 'click hover'
		, $            = jQuery
	;

	function isElem(k,a) {var i=0; while ((i<a.length) && (a[i] != k))	i++; return i < a.length; }

	function filter2(es, f) {
		var a = [], b = [];

		_.each(es, function(e) {
			if (f.call(null, e)) a.push(e);
			else b.push(e);
		});
		return [a,b];
	}

	function traverse(tree, f) {
		f.call(tree, tree);

		_.each(tree.childNodes, function(branch) {
			traverse(branch, f);
		});
	}


	// Local functions

	function fireEvents(elem, es, data, ix) {
		_.each(es, function(e,k) {
			$(elem).on(k, function(event) {
				e.call(this, event, data, ix);
			});
		});
	}
	function fst(a) { return a[0]; }
	function snd(a) { return a[1]; }
	function thd(a) { return a[2]; }

	function fireCSS(el, css) {
		$(el).css(css);
	}

	function getEvents(os) {
		var events = os.events || {};
		delete os.events;

		_.each(os, function(o,k) {
			if (isElem(k, mainEvents.split(' '))) {
				events[k] = o;
				delete os[k];
			}
		});

		return events;
	}

	function appendContent(el, cs) {
		if (_.isString(cs))
			el.appendChild(document.createTextNode(cs));
		else if (_.isArray(cs))
			_.each(cs, function(c) { appendContent(el, c); });
		else if (_.isElement(cs))
			el.appendChild(_.first($(cs).clone(true)));

		return el;
	}

	function createEl_(n, os, ix) {
		var el = document.createElement(n)
			, content
			, events
			, css
			, comp
		;

		if (_.isUndefined(os)) os = {}
		if (_.isElement(os) || _.isArray(os)) os = {content: os}
		if (_.isString(os))	os = isElem(n, tagWithSrc.split(' ')) ? {src: os} : {content: os};

		// Handle events
		events = getEvents(os);
		fireEvents(el, events, os.data, ix);

		// Get CSS
		if (os.css) fireCSS(el, os.css);
		delete os.css;


		// Get content
		content = os.content || '';
		delete os.content;

		// Get complete
		comp = os.complete;
		delete os.complete;

		// Append the content
		if (content) el = appendContent(el, content,ix);

		// Set attributes
		_.each(os, function(o,k) {
			if (k != 'data') el.setAttribute(k,o);
		});

		// Fire `complete` if existing
		if (comp) comp.call(el, os.data, ix);

		return el;
	}

	function createEl(n, os, that) {
		var el   = []
		;

		if (_.isArray(os))
			_.each(os, function(o) {
				el.push(createEl_(n, o));
			});
		else el.push(createEl_(n, os || {}));

		that.data = that.data.concat(el);
	}

	function getItemArgs(os) {

		var r = _.extend({}, os.itemArgs);
		if (os.content) r.content = os.content;

		return r;
	}

	function getValue(vs, i) {
		if (vs.length == 1) return i[vs];

		return getValue(_.rest(vs), i[_.first(vs)]);
	}

	function  listFn(os, con) {
		var lis
			, ul
			, iTag   = os.itemTag || 'li'
			, jItems = os.justItems
			, self   = this
			, listFn = ['head', 'rest', 'initial', 'last']
			, lFn    = []
		;
		if (_.isNumber(os.items)) os.items = _.range(os);

		// Filter out the list functions
		_.each(listFn, function(f) {
			if (isElem(f, _.keys(os.itemArgs))) lFn.push({name: f, fn: os.itemArgs[f]});
			delete os.itemArgs[f];
		});

		lis = os.items.map(function(item, index) {
			var o = getItemArgs(os)
				, el
				, el_
				, insert = {
					value: item
					, index: index
				}
			;
			o.data = item;
			
			el = createEl_(iTag, o, index);
			traverse(el, function(element) {
				_.each(element.attributes, function(attr) {
					attr.value = attr.value.replace(/<<.[a-z,.,0-9,_,-,:,$]*>>/gi, function(e) {
						e = e.substr(2, e.length-4);
						if (_.first(e) == 'v') {
							return getValue(e.split('.'), insert);
						}
						else return insert[e];
					});
				});	
				if (element instanceof Text) {
					element.nodeValue = element.nodeValue.replace(/<<.[a-z,.,0-9,_,-,:,$]*>>/gi, function(e) {
						e = e.substr(2, e.length-4);
						if (_.first(e) == 'v'){
							return getValue(e.split('.'), insert);
						}
						else return insert[e];
					});
				}
			});

			return el;
		});

		_.each(lFn, function(l) {
			var is = _[l.name](lis)
				, ds = _[l.name](os.items)
			;

			if (_.isElement(is)) l.fn.call(is, ds);
			else if (_.isArray(is)) {
				_.each(is, function(i, ix) {
					l.fn.call(i, ds[ix]);
				});
			}
		});


		delete os.items;
		delete os.itemArgs;
		delete os.itemTag;
		delete os.content;
		delete os.justItems;

		if (con) {
			if (jItems) return lis.map(function(li) {	return _.first($(li).clone(true));
			});
			ul = createEl_('ul', os);

			_.each(lis, function(li) {
				ul.appendChild(_.first($(li).clone(true)));
			});

			return ul;
		}

		if (jItems) self.data = self.data.concat(lis.map(function(li) { return _.first($(li).clone(true)); }));
		else {
			ul = createEl_('ul', os);

			_.each(lis, function(li) {
				ul.appendChild(_.first($(li).clone(true)));
			});

			self.data.push(ul);
		}

		return self;
	}




	// Prototype functions

	function Huk(selector) {
		this.el        = $(selector);
		this.data      = [];
	}

	

	Huk.prototype.list = listFn;
	Huk.constructor.prototype.list = function(os) {
		return listFn.call(Huk, os, true);
	};

	Huk.constructor.prototype.addTag = function(n) {
		Huk.prototype[n] = function(os) { createEl(n, os, this); return this; };

		Huk.constructor.prototype[n] = function(os) {
			return createEl_(n, os);
		};
	};

	// Applying function to all of the HTML tags
	_.each(HTMLElements.split(' '), function(e) {
		Huk.addTag(e);
	});


	_.each(insertFn.split(' '), function(f) {
		Huk.prototype[f] = function() {
			var el = this.el;

			// Insert the HTML in the page
			$(el)[f](this.data);
		};
	});

	Huk.prototype.val = function() { return this.data; };

	Huk.constructor.prototype.bundle = function(name, bundle) {
		Huk.constructor.prototype[name] = function(data, isList) {
			return (isList) ?
				huk.list({
					items: data
					, justItems: true
					, itemTag: _.isString(isList) ? isList : 'li'
					, itemArgs: {
						complete: function(data_) {
							$(this).html(bundle.call(Huk, data_))
						}
					}
				}) :
				bundle.call(Huk, data);
		};

		Huk.prototype[name] = function(data, isList) {
			this.data = this.data.concat((isList) ?
				huk.list({
					items: data
					, justItems: true
					, itemTag: _.isString(isList) ? isList : 'li'
					, itemArgs: {
						complete: function(data_) {
							$(this).html(bundle.call(Huk, data_))
						}
					}
				}) : bundle.call(this, data));

			return this;
		};
	};

	function huk(selector) {
		return new Huk(selector);
	}

	return huk;
});