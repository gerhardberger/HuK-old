(function (name, definition) {
	if (typeof module != 'undefined') module.exports = definition();
	else if (typeof define == 'function' && define.amd) define(name, definition);
	else this[name] = definition();
})('huk', function() {

	'use strict';

	var HTMLElements = 'a area article adress abbr audio b button base bdi bdo center blockquote cite col'  +
										 ' colgroup command datalist details dl figure footer header hgroup map keygen kbd'   +
										 ' mark meter nav noscript object param output progress rp rt ruby section source sub'+
										 ' summary time tfoot sup track video wbr figcaption caption canvas code div dt dd'   +
										 ' em fieldset font form h1 h2 h3 h4 h5 h6 i iframe img input label li menu meta ol p'+
										 ' pre script select span strong style table tbody td tr textarea ul hr'
		, tagWithSrc   = 'img iframe audio video'
		, insertFn     = 'append after before html text prepend'
		, mainEvents   = 'click hover'
		, $            = jQuery || ender
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
			el.appendChild(cs.cloneNode(true));

		return el;
	}

	function createEl_(n, os, ix) {
		var el = document.createElement(n)
			, content
			, events
			, css
		;

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

		// Append the content
		if (content) el = appendContent(el, content,ix);

		// Set attributes
		_.each(os, function(o,k) {
			if (k != 'data') el.setAttribute(k,o);
		});

		return el;
	}

	function createEl(n, os, that) {
		var comp = []
			, el   = []
		;

		if (_.isUndefined(os)) os = {};

		if (_.isArray(os)) {
			_.each(os, function(o) {
				comp.push(o.complete);
				delete o.complete;
				el.push(createEl_(n, o));
			});
		}
		else {
			if (_.isFunction(os.complete)) {
				comp.push(os.complete);
				delete os.complete;
			}
			el.push(createEl_(n, os));
		}

		if (!_.isEmpty(comp)) that.completes.push([comp, os.data, el]);

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

	function  listFn(os) {
		var lis
			, ul
			, iTag   = os.itemTag || 'li'
			, jItems = os.justItems
			, self   = this
		;
		if (_.isNumber(os.items)) os.items = _.range(os);

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

			_.each(el.attributes, function(attr) {
				attr.value = attr.value.replace(/<<.[a-z,.,0-9,_,-]*>>/gi, function(e) {
					e = e.substr(2, e.length-4);
					if (_.first(e) == 'v') {
						return getValue(e.split('.'), insert);
					}
					else return insert[e];
				});
			});


			el.innerHTML = el.innerHTML.replace(/&lt;&lt;.[a-z,.,0-9,_,-]*&gt;&gt;/gi, function(e) {
				e = e.substr(8, e.length-16);
				if (_.first(e) == 'v'){
					return getValue(e.split('.'), insert);
				}
				else return insert[e];
			});

			return el;
		});

		delete os.items;
		delete os.itemArgs;
		delete os.itemTag;
		delete os.content;
		delete os.justItems;

		if (jItems) self.data = self.data.concat(lis);
		else {
			ul = createEl_('ul', os);

			_.each(lis, function(li) {
				ul.appendChild(li);
			});

			self.data.push(ul);
		}

		return self;
	}




	// Prototype functions

	function Huk(selector) {
		this.el        = $(selector);
		this.data      = [];
		this.completes = [];
	}

	

	Huk.prototype.list = listFn;
	Huk.constructor.prototype.list = listFn;

	Huk.constructor.prototype.addTag = function(n) {
		Huk.prototype[n] = function(os) { createEl(n, os, this); return this; };

		Huk.constructor.prototype[n] = function(os) {
			return createEl_(n, os);
		};
	};

	_.each(HTMLElements.split(' '), function(e) {
		Huk.addTag(e);
	});

	_.each(insertFn.split(' '), function(f) {
		Huk.prototype[f] = function() {
			var el = this.el;

			$(el)[f](this.data);

			_.each(this.completes, function(c) {
				_.each(thd(c), function(e,i) {
					var f = fst(c)[i];
					if (!_.isUndefined(f))f.call(e, snd(c));
				});
			});
		};
	});
	Huk.prototype.val = function() { return this.data; };

	function huk(selector) {
		return new Huk(selector);
	}

	return huk;
});