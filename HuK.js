!function (name, definition) {
	if (typeof module != 'undefined') module.exports = definition()
	else if (typeof define == 'function' && define.amd) define(name, definition)
	else this[name] = definition()
}('HuK', function() {
	function Protoss(selector) {
		this.length = 1
		this.val = []
		this.selector = selector
	}
	var result = '',
			isText = false,
			elTree = []
			eventArr = [],
			events = ['hover', 'blur ', 'change', 'click', 'dblclick', 'focusin', 'focusout', 'keydown', 'keypress', 'keyup', 'mousedown', 'mouseenter', 'mouseleave', 'mouseout', 'mouseover', 'mousemove', 'resize', 'scroll', 'select', 'submit', 'unload'],

	each = function(a, b) {
		for (var i in a)
			b.call(a[i], a[i], (isNaN(parseInt(i)) ? i : parseInt(i)))
	}
	function isEvent(k) {
		var i = 0
		while ((i<events.length) && (events[i] != k))
			i++
		return i < events.length
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
	function runEvents() {
		each(eventArr, function(e) {
			var binding = {
				path: e.target
			}
			if (e.event == 'hover')
				$(e.target).hover(e.fn.bind(null,binding))
			else if (e.event == 'resize')
				$(e.target).resize(e.fn.bind(null,binding))
			else
				$(e.target).bind(e.event, e.fn.bind(null,binding))
		})
	}

	function parse(obj) {
		if (isEmpty(obj))
			result += '>'
		for (k in obj) {
			var element = obj[k]
			var eventObj = {}
			each(element, function(elem, key) {
				if ((!(elem instanceof Array)) && (key != 'text') && (!isEvent(key))) {
					if (key == 'css') {
						result += ' style="'
						each(elem, function(e,k) {
							result += k+': '+e+';'
						})
						result += '"'
					}
					else
						result += ' '+key+'="'+elem+'"'

					if (key == 'text')
						eventObj['content'] = elem
				}
			})
			if ((!isEmpty(result)) && (result[result.length-1] != '>') && (!isText))
				result += '>'
			isText = false
			each(element, function(elem, key) {
				if (element.id) {
					elTree.splice(elTree.length-1,1)
					elTree.push('#'+element.id)
				}
				else if (element.class) {
					elTree.splice(elTree.length-1,1)
					elTree.push('.'+element.class)
				}					
					
				if (isEvent(key)) {
					eventObj['event'] = key
					eventObj['target'] = elTree.join(' ')
					eventObj['fn'] = element[key]
				
					eventArr.push(eventObj)
				}
				else
				if (elem instanceof Array) {
					elTree.push(key)
					result += '<'+key
					parse(elem)
					result += '</'+key+'>'
					elTree.splice(elTree.length-1,1)
				}
				else if (key == 'text') {
					isText = true
					result += elem
				}
			})
		}
	}
	function listContentTrack(cont, value, index, index2) {
		if (typeof cont === 'string') {			
			var arr = cont.match(/<<.[^ ,>>,<<]*>>/gi)
			each(arr, function(e) {
				eval('cont = cont.replace(/<<.[^ ,>>,<<]*>>/i, '+e.substr(2,(e.length-4))+')')
			})
			return cont
		}
		else if ((cont instanceof Array) || (cont instanceof Object)) {
			for (k in cont)
				cont[k] = listContentTrack(cont[k], value, index, index2)
			return cont
		}
		else if (cont !== void 0)
			return cont
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
			result = ''
			var obj = this.val
			parse(obj)
			return result
		},
		build: function(elem) {
			var obj = {}
			obj[elem.name] = []

			var args = {};
			each(elem, function(e, k) {
				if ((k != 'name') && (!(e instanceof Array)) && (k != 'text')&& (k != 'content'))
					args[k] = e	
			})
			if (!isEmpty(args))
				obj[elem.name].push(args)

			if (elem.content !== void 0) {
				if (elem.content instanceof Array)
					each(elem.content, function(insideElement) {
						if (typeof insideElement === 'string') {
							var keyName = 'text'
							var tmp = {}
							tmp[keyName] = insideElement
							obj[elem.name].push(tmp)
						}
						else
							obj[elem.name].push(insideElement)
					})
				else {
					if (typeof elem.content === 'string') {
						var keyName = 'text',
								tmp = {}
						tmp[keyName] = elem.content
						obj[elem.name].push(tmp)
					}
					else
						obj[elem.name].push(elem.content)
				}
			}
			return obj
		},
		list: function(args) {
			var argObj = {}
			for (k in args)
				if ((k != 'items') && (k != 'content') && (k != 'ordered') && (k != 'itemargs') && (k != 'itemArgs') && (k != 'justItems') && (k != 'justitems'))
					argObj[k] = args[k]
			var result = (!isEmpty(argObj)) ? this.ul(argObj, true) : {ul: []},
				ordered = ((args.ordered !== void 0) && (args.ordered)),
				justItems = (((args.justItems !== void 0) && (args.justItems)) || ((args.justitems !== void 0) && (args.justitems)))
			
			if (isNumber(args.items))
				result.ul = this.li(args.items, true)
			else if (args.items instanceof Array) {
				for (var i = 0; i < args.items.length; i++) {
					if (args.itemArgs) {

						var o = listContentTrack(clone(args.itemArgs), args.items[i], i)
					}
					else
						var o = {}
					if (args.content !== void 0)
						o.content = listContentTrack(clone(args.content), args.items[i], i)
					result.ul.push(this.li(o, true))
				}
			}
			if (justItems) {
				for (k in result.ul)
					this.val.push(result.ul[k])
			}
			else
				this.val.push(result)
			return this
		},
		Table: function(args) {
			var argObj = {}
			for (k in args)
				if ((k != 'items') && (k != 'content') && (k != 'ordered') && (k != 'itemargs') && (k != 'itemArgs') && (k != 'justItems') && (k != 'justitems'))
					argObj[k] = args[k]
			if (!isEmpty(argObj)) {
				argObj.css = 'display:table;'
				var table  = this.div(argObj, true)
			}
			else
				var table = {div: [{style: 'display:table;'}]}
			if (args.row === void 0)
				args.col = args.row
			else if (args.col === void 0)
				args.row = args.col
			if (args.items) {
				args.row = args.items.length
				args.col = (args.items[0].length !== void 0) ?  args.items[0].length : 1
			}

			for (var i = 0; i<args.row; i++) {
				var row = {div: [{style: 'display:table-row;'}]}
				for (var j = 0; j<args.col;j++) {
					if (args.itemArgs)
						var o = (args.items) ? listContentTrack(clone(args.itemArgs), args.items[i][j], i, j) : listContentTrack(clone(args.itemArgs), '', i, j)
					else
						var o = {}
					if (args.content !== void 0)
						args.items ? o.content = listContentTrack(clone(args.content), args.items[i][j], i, j) : o.content = listContentTrack(clone(args.content), '', i, j)

					o.css ? o.css  += 'display:table-cell;' : o.css = 'display:table-cell;'
					row.div.push(this.div(o, true))
				}
				table.div.push(row)
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
    },
    text: function () {
			this.selector.html(this.norris())
			runEvents()
    },
		append: function () {
			this.selector.append(this.norris())
			runEvents()
    },
    before: function () {
			this.selector.before(this.norris())
			runEvents()
    },
		after: function () {
			this.selector.after(this.norris())
			runEvents()
    },
    prepend: function () {
			this.selector.prepend(this.norris())
			runEvents()
    }
	}
	var HuKelementArray = ['a', 'b', 'button', 'center', 'canvas', 'code', 'div', 'em', 'font', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'i', 'iframe', 'img', 'input', 'label', 'li', 'menu', 'meta', 'ol', 'p', 'pre','script', 'select', 'span', 'strong', 'style', 'table', 'td', 'tr', 'textarea', 'ul']
	each(HuKelementArray, function(name) {
		Protoss.prototype[name] = function(elem,local) {
			if(isNumber(elem)){ 
				var arr = []	
				for(var i=0;i<elem;i++)	
					if (local)
						arr.push(this.build({name: name}))
					else 
						this.val.push(this.build({name: name}))
				return (local) ? arr : this
			}	else if (typeof elem === 'string') {
				this.val.push(this.build({name:name, content: elem}))
				return this
			}	else if (elem instanceof Array){
				var arr = []
				for(i in elem)
					if (local)
						arr.push(this.build(elem[i]))
					else 
						this.val.push(this.build(elem[i]))
				return (local) ? arr : this
			}
			else if (elem === void 0) {
				if (local) return this.build({name:name})
				this.val.push(this.build({name:name}))
				return this
			}
			else{
				elem.name=name
				if (local) return this.build(elem)
				this.val.push(this.build(elem))
				return this
			}
		};
	})

	function HuK(selector) {
		return (selector) ? new Protoss($(selector)) : new Protoss()
	}
	return HuK
})