if (!Function.prototype.bind) {  
  Function.prototype.bind = function (oThis) {  
    if (typeof this !== "function") { throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable"); }
    var aArgs = Array.prototype.slice.call(arguments, 1),   
        fToBind = this,   
        fNOP = function () {},  
        fBound = function () {  
          return fToBind.apply(this instanceof fNOP  
                                 ? this  
                                 : oThis || window,  
                               aArgs.concat(Array.prototype.slice.call(arguments)));  
        };  
    fNOP.prototype = this.prototype;  
    fBound.prototype = new fNOP();   
    return fBound;  
  };  
}
!function (name, definition) {
	if (typeof module != 'undefined') module.exports = definition()
	else if (typeof define == 'function' && define.amd) define(name, definition)
	else this[name] = definition()
}('HuK', function() {

	'use strict'

	function Protoss(selector) {
		this.length = 1
		this.val = []
		this.selector = selector
	}
	var result = ''
		, isText = false
		, listValueArr = []
		, elTree = []
		, eventArr = []
		, events = ['hover', 'blur ', 'change', 'click', 'dblclick', 'focusin', 'focusout', 'keydown'
				, 'keypress', 'keyup', 'mousedown', 'mouseenter', 'mouseleave', 'mouseout', 'mouseover'
				, 'mousemove', 'resize', 'scroll', 'select', 'submit', 'unload', 'complete']
		, bootstrapArr = ['modal', 'dropdown', 'scrollspy', 'tab', 'tooltip', 'popover'
				, 'alert', 'button', 'collapse', 'carousel', 'typeahead']
		, bootArr = []
		,	HuKelementArray = ['a', 'area', 'article', 'adress', 'abbr', 'audio', 'b', 'button', 'base', 'bdi', 'bdo', 'center'
				, 'blockquote', 'cite', 'col', 'colgroup', 'command', 'datalist', 'details', 'dl', 'figure', 'footer', 'header'
				, 'hgroup', 'map', 'keygen', 'kbd', 'map', 'mark', 'meter', 'nav', 'noscript', 'object', 'param', 'output', 'progress'
				, 'rp', 'rt', 'ruby', 'section', 'source', 'summary', 'sub', 'time', 'tfoot', 'sup', 'track', 'video', 'wbr', 'figcaption'
				, 'caption', 'canvas', 'code', 'div', 'dt', 'dd', 'em', 'fieldset', 'font', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
				, 'i', 'iframe', 'img', 'input', 'label', 'li', 'menu', 'meta', 'ol', 'p', 'pre','script', 'select', 'span'
				, 'strong', 'style', 'table', 'tbody', 'td', 'tr', 'textarea', 'ul', 'hr']
		, elseArr = ['name', 'content', 'listValueIndex', 'data']
		, specialListArg = ['items', 'content', 'ordered', 'itemargs', 'itemArgs', 'justItems', 'justitems']
		, shortTags = ['input', 'img', 'br', 'col', 'hr', 'link', 'meta', 'param', 'source']


	function each(a, b) {
		if ((!isArray(a)) || (!isObject(a))) b.call(a,a)
		else
			for (var i in a)
				b.call(a[i], a[i], (isNaN(parseInt(i)) ? i : parseInt(i)))
	}
	function isElem(arr,k) {
		var i = 0
		while ((i<arr.length) && (arr[i] != k))	i++
		return i < arr.length
	}
	function notElse(k) {
		return !isElem(elseArr,k)
	}
	function isBootstrap(k) {
		return isElem(bootstrapArr,k)
	}
	function isEvent(k) {
		return isElem(events,k)
	}
	function isEmpty(a) {
		if (a instanceof Array || typeof a === 'string')
			return a.length===0
		for (var c in a)
			if(Object.prototype.hasOwnProperty.call(a,c))
				return!1
		return!0
	}
	function isNumber(e) {
		return!! (e===0 || e && e.toExponential && e.toFixed)
	}
	function prepend(e,a) {
		for (var i = a.length-1; i>=0; i--)	a[i+1] = a[i]
		a[0] = e		
		return a
	}
	function isFunction(a) {
		return! (!a || !a.constructor || !a.call || !a.apply)
	}
	function isUndefined(a) {
		return (a === void 0)
	}
	function isArray(a) {
		return (a instanceof Array)
	}
	function isObject(a) {
		return (a instanceof Object)
	}
	function isString(a) {
		return (typeof a === 'string')
	}
	function runEvents() {
		each(eventArr, function(e) {
			var binding = {
				path: e.target,
				data: (e.val) ? e.val.val : null,
				index: (e.val) ? ((e.val.i) ? e.val.i : 0) : null
			}
			e.event == 'complete' ?	e.fn.call(binding,binding) : $(e.target)[e.event](e.fn.bind(binding,binding))
		})
	}
	function runBootstrap() {
		if (isEmpty(bootArr)) return
		each(bootArr, function(e) {
			e.val == true ? $(e.target)[e.fn].call($(e.target)) :	$(e.target)[e.fn].call($(e.target), e.val)
		})
	}

	function parse(obj) {
		if (isArray(obj))
			each(obj, function(e) {
				parse(e)
			})
		else if (!isUndefined(obj.name)) {
			elTree.push((obj.id) ? '#'+obj.id : ((obj.class) ? '.'+obj.class.split(' ')[0] : obj.name))
			result += '<'+obj.name
			for (var i in obj)
				if (isEvent(i)) {
					var eventObj = {
						event: i,
						fn: obj[i],
						target: elTree.join(' '),
					}
					if (!isUndefined(obj.listValueIndex))	eventObj['val'] = listValueArr[obj.listValueIndex]
					else if (obj.hasOwnProperty('data'))
						eventObj['val'] = {
							path: eventObj.target,
							val: obj.data
						}
					eventArr.push(eventObj)
				} else if (isBootstrap(i)) {
					var bootObj = {
						fn: i,
						val: obj[i],
						target: elTree.join(' '),
					}
					bootArr.push(bootObj)
				}	else if (notElse(i))
					result += ' '+i+'="'+obj[i]+'"'
			result += '>'
			if (!isUndefined(obj.content)) parse(obj.content)
			result += '</'+obj.name+'>'
			elTree.splice(elTree.length-1,1)
		}
		else if (isString(obj))	result += obj
	}
	function listContentTrack(cont, value, index, index2) {
		if (typeof cont === 'string') {			
			var arr = cont.match(/<<.[^ ,>>,<<]*>>/gi)
			if (!isEmpty(arr))
				each(arr, function(e) {	eval('cont = cont.replace(/<<.[^ ,>>,<<]*>>/i, '+e.substr(2,(e.length-4))+')') })
			return cont
		}
		else if ((cont instanceof Array) || (cont instanceof Object)) {
			for (var k in cont)
				isEvent(k) ? cont['listValueIndex'] = listValueArr.length-1 : cont[k] = listContentTrack(cont[k], value, index, index2)
			return cont
		}
		else if (cont !== void 0) return cont
	}
	function clone(obj) {
	  if (null == obj || "object" != typeof obj) return obj;
	  if (obj instanceof Date) {
	    var copy = new Date();
	    copy.setTime(obj.getTime());
	    return copy;
	  }
	  if (obj instanceof Array) {
	    var copy = []
	    var len = obj.length
	    for (var i = 0; i < len; ++i)
	      copy[i] = clone(obj[i])
	    return copy
	  }    
	  if (obj instanceof Object) {
	    var copy = {}
	    for (var attr in obj)
	    if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr])
	    return copy
	  }
	  throw new Error("Unable to copy obj! Its type isn't supported.");
	}

	Protoss.prototype = {
		norris: function(args) {
			elTree = []
			eventArr = []
			bootArr = []
			result = ''
			var obj = this.val
			parse(obj)
			return result
		},
		list: function(args) {
			var argObj = {}
				, itemTag = (args.itemTag) ? args.itemTag : 'li'
			for (var k in args)
				if (!isElem(specialListArg, k))	argObj[k] = args[k]

			var result = (!isEmpty(argObj)) ? this.ul(argObj, true) : {name: 'ul'},
				ordered = ((args.ordered !== void 0) && (args.ordered)),
				justItems = (((args.justItems !== void 0) && (args.justItems)) || ((args.justitems !== void 0) && (args.justitems)))
			result.content = []	
			if (isNumber(args.items))
				result.ul = this[itemTag](args.items, true)
			else if (args.items instanceof Array) {
				for (var i = 0; i < args.items.length; i++) {
					listValueArr.push({val: args.items[i], i: i})
					var o = (args.itemArgs) ? listContentTrack(clone(args.itemArgs), args.items[i], i) : {}
					if (args.content !== void 0)
						o.content = listContentTrack(clone(args.content), args.items[i], i)
					o.listValueIndex = listValueArr.length-1
					result.content.push(this[itemTag](o, true))
				}
			}
			if (justItems)
				for (k in result.content)
					this.val.push(result.content[k])
			else this.val.push(result)
			return this
		},
		Table: function(args) {
			var argObj = {}
			for (k in args)
				if (!isElem(specialListArg, k))
					argObj[k] = args[k]
			if (!isEmpty(argObj)) {
				argObj.style = 'display:table;'
				var table  = this.div(argObj, true)
				table.content = []
			}
			else
				var table = {name: 'div', style: 'display:table;', content: []}
			if (args.row === void 0)
				args.col = args.row
			else if (args.col === void 0)
				args.row = args.col
			if (args.items) {
				args.row = args.items.length
				args.col = (args.items[0].length !== void 0) ?  args.items[0].length : 1
			}
			for (var i = 0; i<args.row; i++) {
				var row = {name: 'div', style: 'display:table-row;', content: []}
				for (var j = 0; j<args.col;j++) {
					if (args.itemArgs)
						var o = (args.items) ? listContentTrack(clone(args.itemArgs), args.items[i][j], i, j) : listContentTrack(clone(args.itemArgs), '', i, j)
					else
						var o = {}
					if (args.content !== void 0)
						args.items ? o.content = listContentTrack(clone(args.content), args.items[i][j], i, j) : o.content = listContentTrack(clone(args.content), '', i, j)

					o.style ? o.style  += 'display:table-cell;' : o.style = 'display:table-cell;'
					row.content.push(this.div(o, true))
				}
				table.content.push(row)
			}
			this.val.push(table)
			return this
		},
		value: function() {
			var val = this.val
			this.val = []
			return (val.length == 1) ? val[0] : val
		},
		html: function () {
			this.selector.html(this.norris())
			runEvents()
			runBootstrap()
    },
    text: function () {
			this.selector.html(this.norris())
			runEvents()
			runBootstrap()
    },
		append: function () {
			this.selector.append(this.norris())
			runEvents()
			runBootstrap()
    },
    before: function () {
			this.selector.before(this.norris())
			runEvents()
			runBootstrap()
    },
		after: function () {
			this.selector.after(this.norris())
			runEvents()
			runBootstrap()
    },
    prepend: function () {
			this.selector.prepend(this.norris())
			runEvents()
			runBootstrap()
    }
	}


	function HuK(selector) {
		return selector ? new Protoss($(selector)) : new Protoss()
	}

	HuK.constructor.prototype['addTag'] = function(name) {
		Protoss.prototype[name] = function(elem,local) {
			if(isNumber(elem)){ 
				var arr = []	
				for(var i=0;i<elem;i++)	
					local ? arr.push({name: name}) : this.val.push({name: name})
					return local ? arr : this
			}	else if (typeof elem === 'string') {
				this.val.push({name:name, content: elem})
				return this
			}	else if (elem instanceof Array){
				var arr = []
				for(i in elem)
					local ? arr.push(elem[i]) : this.val.push(elem[i])
				return local ? arr : this
			}
			else if (isUndefined(elem)) {
				if (local) return {name:name}
				this.val.push({name:name})
				return this
			}
			else {
				elem.name=name
				if (local) return elem
				this.val.push(elem)
			return this
			}
		};
	}

	each(HuKelementArray, function(name) {
		HuK.addTag(name)
		HuK.constructor.prototype[name] = function(elem) {
			return HuK()[name](elem).value()
		};
	})
	HuK.constructor.prototype['list'] = function(elem) {
		return HuK()['list'](elem).value()
	};
	return HuK
})