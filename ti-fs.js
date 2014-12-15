module.exports=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],3:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],4:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":3,"_process":2,"inherits":1}],5:[function(require,module,exports){
var $F = Ti.Filesystem,
	fs = exports,
	util = require('util');

var IS_ANDROID = Ti.Platform.osname === 'android';

var MODE_MAP = {};
MODE_MAP['r'] = MODE_MAP['r+'] = MODE_MAP['rs'] = MODE_MAP['rs+'] = $F.MODE_READ;
MODE_MAP['w'] = MODE_MAP['w+'] = MODE_MAP['wx'] = MODE_MAP['wx+'] = $F.MODE_WRITE;
MODE_MAP['a'] = MODE_MAP['a+'] = MODE_MAP['ax'] = MODE_MAP['ax+'] = $F.MODE_APPEND;

fs.Stats = function Stats(path) {
	this.__file = null;
	this.dev = 0;
	this.ino = 0;
	this.nlink = 0;
	this.uid = 0;
	this.gid = 0;
	this.rdev = 0;
	this.size = 0;
	this.blksize = 4096;
	this.blocks = 8;
	this.ctime = this.atime = this.mtime = 0;

	if (path) {
		this.__file = $F.getFile(path);
		if (!this.__file.exists()) {
			throw new Error('file does not exist');
		}

		this.size = this.__file.size;
		this.mode = 0;
		this.ctime = new Date(this.__file.createTimestamp());
		this.atime = this.mtime = new Date(this.__file.modificationTimestamp());
	}
};

fs.Stats.prototype.isDirectory = function(property) {
	return this.__file.isDirectory();
};

fs.Stats.prototype.isFile = function(property) {
	return this.__file.isFile();
};

fs.Stats.prototype.isBlockDevice = function(property) {
	return false;
};

fs.Stats.prototype.isCharacterDevice = function(property) {
	return false;
};

fs.Stats.prototype.isSymbolicLink = function(property) {
	return this.__file.symbolicLink;
};

fs.Stats.prototype.isFIFO = function(property) {
	return false;
};

fs.Stats.prototype.isSocket = function(property) {
	return false;
};

fs.exists = function exists(path, callback) {
	setTimeout(function() {
		return callback(fs.existsSync(path));
	}, 0);
};

fs.existsSync = function existsSync(path) {
	return $F.getFile(path).exists();
};

fs.readFile = function readFile(path, options, callback_) {
	var callback = maybeCallback(arguments[arguments.length-1]);
	if (!options || util.isFunction(options)) {
		options = { encoding: null, flag: 'r' };
	} else if (util.isString(options)) {
		options = { encoding: options, flag: 'r' };
	} else if (!util.isObject(options)) {
		throw new TypeError('Bad arguments');
	}

	var encoding = options.encoding,
		flag = options.flag || 'r';
	assertEncoding(options.encoding);

	fs.open(path, flag, function(err, fd) {
		if (err) { return callback(err); }
		fs.fstat(fd, function(err, stats) {
			if (err) { return callback(err); }
			var buffer = Ti.createBuffer({length:stats.size});
			fs.read(fd, buffer, function(err, data) {
				if (err) { return callback(err); }
				fs.close(fd, function(err) {
					if (err) { return callback(err); }
					return callback(err, encoding ? convertBuffer(buffer, encoding) : buffer);
				});
			});
		});
	});
};

fs.readFileSync = function readFileSync(path, options) {
	if (!options) {
		options = { encoding: null, flag: 'r' };
	} else if (util.isString(options)) {
		options = { encoding: options, flag: 'r' };
	} else if (!util.isObject(options)) {
		throw new TypeError('Bad arguments');
	}

	var encoding = options.encoding,
		flag = options.flag || 'r';
	assertEncoding(options.encoding);

	var fd = fs.openSync(path, flag /*, mode */),
		size = fs.fstatSync(fd).size,
		buffer = Ti.createBuffer({length:size});

	fs.readSync(fd, buffer);
	fs.closeSync(fd);

	return encoding ? convertBuffer(buffer, encoding) : buffer;
};

fs.close = function close(fd, callback) {
	setTimeout(function() {
		var err = null;
		try {
			fd.close();
		} catch (e) {
			err = e;
		}
		return callback(err);
	}, 0);
};

fs.closeSync = function closeSync(fd) {
	fd.close();
};

fs.open = function open(path, flags, mode, callback) {
	callback = maybeCallback(arguments[arguments.length-1]);
	if (!mode || util.isFunction(mode)) {
		mode = null;
	}

	setTimeout(function() {
		var fd = null,
			err = null;
		try {
			fd = fs.openSync(path, flags, mode);
		} catch (e) {
			err = e;
		}
		return callback(err, fd);
	}, 0);
};

fs.openSync = function openSync(path, flags, mode) {
	var tiMode = assertFlags(flags),
		file = $F.getFile(path),
		fd = file.open(tiMode);
	fd.__path = path;
	return fd;
};

fs.read = function read(fd, buffer, offset, length, position, callback) {
	// position is not handled in Titanium streams
	callback = maybeCallback(arguments[arguments.length-1]);
	if (util.isFunction(position)) { position = undefined; }
	if (util.isFunction(length)) { length = undefined; }
	if (util.isFunction(offset)) { offset = undefined; }

	// TODO: This should be Ti.Stream.read(), but it doesn't appear to do
	// anything when targeting a FileStream, despite the docs.
	setTimeout(function() {
		var bytes = null,
			err = null;
		try {
			bytes = fs.readSync(fd, buffer, offset, length, position);
		} catch (e) {
			err = e;
		}
		return callback(err, bytes, buffer);
	}, 0);
};

// Android improperly handles undefined args passed to offset and/or length
if (IS_ANDROID) {
	fs.readSync = function readSync(fd, buffer, offset, length, position) {
		if (offset == null && length == null) {
			return fd.read(buffer);
		} else {
			return fd.read(buffer, offset, length);
		}
	};
} else {
	fs.readSync = function readSync(fd, buffer, offset, length, position) {
		return fd.read(buffer, offset, length);
	};
}

fs.write = function write(fd, buffer, offset, length, position, callback) {
	// position is not handled in Titanium streams
	callback = maybeCallback(arguments[arguments.length-1]);
	if (util.isFunction(position)) { position = undefined; }
	if (util.isFunction(length)) { length = undefined; }
	if (util.isFunction(offset)) { offset = undefined; }

	// TODO: This should be Ti.Stream.write(), but it doesn't appear to do
	// anything when targeting a FileStream, despite the docs.
	setTimeout(function() {
		var bytes = null,
			err = null;
		try {
			bytes = fs.writeSync(fd, buffer, offset, length, position);
		} catch (e) {
			err = e;
		}
		return callback(err, bytes, buffer);
	}, 0);
};

// Android improperly handles undefined args passed to offset and/or length
if (IS_ANDROID) {
	fs.writeSync = function writeSync(fd, buffer, offset, length, position) {
		if (offset == null && length == null) {
			return fd.write(buffer);
		} else {
			return fd.write(buffer, offset, length);
		}
	};
} else {
	fs.writeSync = function writeSync(fd, buffer, offset, length, position) {
		return fd.write(buffer, offset, length);
	};
}

fs.rename = function rename(oldPath, newPath, callback) {
	setTimeout(function() {
		var err = null,
			good = false;
		try {
			good = $F.getFile(oldPath).move(newPath);
			console.log('good: ' + good);
			if (!good) {
				err = new Error('could not move file');
			}
		} catch (e) {
			err = e;
		}
		return callback(err);
	}, 0);
};

fs.renameSync = function renameSync(oldPath, newPath) {
	$F.getFile(oldPath).move(newPath);
};

fs.truncate = function truncate(path, len, callback) {
	callback = maybeCallback(arguments[arguments.length-1]);
	if (!len || util.isFunction(len)) {
		len = 0;
	}

	if (len) {
		fs.open(path, 'r', function(err, fd) {
			if (err) { return callback(err); }
			var buffer = Ti.createBuffer({length:len});
			fs.read(fd, buffer, 0, len, function(err, bytes, buffer) {
				if (err) { return callback(err); }
				fs.close(fd, function(err) {
					if (err) { return callback(err); }
					fs.writeFile(path, buffer, callback);
				});
			});
		});
	} else {
		fs.writeFile(path, '', callback);
	}
};

fs.truncateSync = function truncateSync(path, len) {
	len = len || 0;
	if (len) {
		var fd = fs.openSync(path, 'r'),
			buffer = Ti.createBuffer({length:len});
		fs.readSync(fd, buffer, 0, len);
		fs.closeSync(fd);
		fs.writeFileSync(path, buffer);
	} else {
		fs.writeFileSync(path, '');
	}
};

fs.ftruncate = function ftruncate(fd, len, callback) {
	if (!fd.__path) {
		throw new Error('invalid file descriptor');
	}

	callback = maybeCallback(arguments[arguments.length-1]);
	if (!len || util.isFunction(len)) {
		len = 0;
	}

	if (len) {
		var buffer = Ti.createBuffer({length:len});
		fs.open(fd.__path, 'r', function(err, fd2) {
			if (err) { return callback(err); }
			fs.read(fd2, buffer, 0, len, function(err, bytes, buffer) {
				if (err) { return callback(err); }
				fs.close(fd2, function(err) {
					if (err) { return callback(err); }
					fs.writeFile(fd.__path, buffer, callback);
				});
			});
		});
	} else {
		fs.writeFile(fd.__path, '', callback);
	}
};

fs.ftruncateSync = function ftruncateSync(fd, len) {
	len = len || 0;
	if (!fd.__path) {
		throw new Error('invalid file descriptor');
	}

	if (len) {
		var buffer = Ti.createBuffer({length:len}),
			fd2 = fs.openSync(fd.__path, 'r');
		fs.readSync(fd2, buffer, 0, len);
		fs.closeSync(fd2);
		fs.writeFileSync(fd.__path, buffer);
	} else {
		fs.writeFileSync(fd.__path, '');
	}
};

fs.rmdir = function rmdir(path, callback) {
	setTimeout(function() {
		var err = null;
		try {
			if (!$F.getFile(path).deleteDirectory()) {
				err = new Error('could not delete directory');
			}
		} catch (e) {
			err = e;
		}
		return callback(err);
	}, 0);
};

fs.rmdirSync = function rmdirSync(path) {
	if (!$F.getFile(path).deleteDirectory()) {
		throw new Error('could not delete directory');
	}
};

if (IS_ANDROID) {
	fs.mkdir = function mkdir(path, mode, callback) {
		callback = maybeCallback(arguments[arguments.length-1]);
		setTimeout(function() {
			var err = null;
			try {
				$F.getFile(path).createDirectory();
				if (!$F.getFile(path).exists()) {
					throw new Error('could not create directory');
				}
			} catch (e) {
				err = e;
			}
			return callback(err);
		}, 0);
	};
} else {
	fs.mkdir = function mkdir(path, mode, callback) {
		callback = maybeCallback(arguments[arguments.length-1]);
		setTimeout(function() {
			var err = null;
			try {
				if (!$F.getFile(path).createDirectory()) {
					err = new Error('could not create directory');
				}
			} catch (e) {
				err = e;
			}
			return callback(err);
		}, 0);
	};
}

if (IS_ANDROID) {
	fs.mkdirSync = function mkdirSync(path, mode) {
		$F.getFile(path).createDirectory();
		if (!$F.getFile(path).exists()) {
			throw new Error('could not create directory');
		}
	};
} else {
	fs.mkdirSync = function mkdirSync(path, mode) {
		if (!$F.getFile(path).createDirectory()) {
			throw new Error('could not create directory');
		}
	};
}

fs.readdir = function readdir(path, callback) {
	setTimeout(function() {
		var files = [],
			err = null;
		try {
			files = fs.readdirSync(path);
		} catch (e) {
			err = e;
		}
		return callback(err, files);
	}, 0);
};

fs.readdirSync = function readdirSync(path) {
	return $F.getFile(path).getDirectoryListing();
};

fs.fstat = function fstat(fd, callback) {
	setTimeout(function() {
		var stats = null,
			err = null;
		try {
			stats = fs.fstatSync(fd);
		} catch (e) {
			err = e;
		}
		return callback(err, stats);
	}, 0);
};

fs.lstat = function lstat(path, callback) {
	setTimeout(function() {
		var stats = null,
			err = null;
		try {
			stats = fs.lstatSync(path);
		} catch (e) {
			err = e;
		}
		return callback(err, stats);
	}, 0);
};

fs.stat = function stat(path, callback) {
	setTimeout(function() {
		var stats = null,
			err = null;
		try {
			stats = fs.statSync(path);
		} catch (e) {
			err = e;
		}
		return callback(err, stats);
	}, 0);
};

fs.fstatSync = function fstatSync(fd) {
	if (fd.__path) {
		return fs.statSync(fd.__path);
	} else {
		throw new Error('invalid file descriptor');
	}
};

fs.lstatSync = function lstatSync(path) {
	return fs.statSync(path);
};

fs.statSync = function statSync(path) {
	return new fs.Stats(path);
};

fs.readlink = function readlink(path, callback) {
	setTimeout(function() {
		var result = null,
			err = null;
		try {
			result = fs.readlinkSync(path);
		} catch (e) {
			err = e;
		}
		return callback(err, result);
	}, 0);
};

fs.readlinkSync = function readlinkSync(path) {
	var file = $F.getFile(path);
	if (!file.symbolicLink) {
		throw new Error('invalid argument \'' + path  +'\'');
	}
	return file.resolve();
};

fs.unlink = function unlink(path, callback) {
	setTimeout(function() {
		var err = null;
		try {
			fs.unlinkSync(path);
		} catch (e) {
			err = e;
		}
		return callback(err);
	}, 0);
};

fs.unlinkSync = function unlinkSync(path) {
	var file = $F.getFile(path);
	if (file.isFile() || file.symbolicLink) {
		if (!file.deleteFile()) {
			throw new Error('unable to delete file');
		}
	} else {
		throw new Error('operation not permitted \'' + path + '\'');
	}
};

fs.writeFile = function writeFile(path, data, options, callback) {
	callback = maybeCallback(arguments[arguments.length-1]);
	if (!options || util.isFunction(options)) {
		options = {};
	}

	setTimeout(function() {
		var err = null;
		try {
			fs.writeFileSync(path, data, options);
		} catch (e) {
			err = e;
		}
		return callback(err);
	}, 0);
};

fs.writeFileSync = function writeFileSync(path, data, options) {
	options = options || {};
	var encoding = options.encoding || 'utf8',
		fd = fs.openSync(path, 'w'),
		buffer;

	if (data.apiName === 'Ti.Buffer') {
		buffer = data;
	} else {
		buffer = Ti.createBuffer({value:data});
	}
	fs.writeSync(fd, buffer);
	fs.closeSync(fd);
};

fs.appendFile = function appendFile(path, data, options, callback_) {
	var callback = maybeCallback(arguments[arguments.length-1]);
	if (!options || util.isFunction(options)) {
		options = {};
	}

	setTimeout(function() {
		var err = null;
		try {
			fs.appendFileSync(path, data, options);
		} catch (e) {
			err = e;
		}
		return callback(err);
	}, 0);
};

fs.appendFileSync = function appendFileSync(path, data, options) {
	options = options || {};
	var encoding = options.encoding || 'utf8',
		fd = fs.openSync(path, 'a'),
		buffer;

	if (data.apiName === 'Ti.Buffer') {
		buffer = data;
	} else {
		buffer = Ti.createBuffer({value:data});
	}
	fs.writeSync(fd, buffer);
	fs.closeSync(fd);
};

// var splitRootRe = /^[\/]*/;
// var nextPartRe = /(.*?)(?:[\/]+|$)/g;
fs.realpathSync = function realpathSync(p, cache) {
	return $F.getFile(p).resolve();

	// p = $F.getFile(p).resolve();

	// if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
	// 	return cache[p];
	// }

	// var original = p,
	// 	seenLinks = {},
	// 	knownHard = {};

	// // current character position in p
	// var pos;
	// // the partial path so far, including a trailing slash if any
	// var current;
	// // the partial path without a trailing slash (except when pointing at a root)
	// var base;
	// // the partial path scanned in the previous round, with slash
	// var previous;

	// start();

	// function start() {
	// 	// Skip over roots
	// 	var m = splitRootRe.exec(p);
	// 	pos = m[0].length;
	// 	current = m[0];
	// 	base = m[0];
	// 	previous = '';
	// }

	// // walk down the path, swapping out linked pathparts for their real
 //  // values
 //  // NB: p.length changes.
 //  while (pos < p.length) {
 //    // find the next part
 //    nextPartRe.lastIndex = pos;
 //    var result = nextPartRe.exec(p);
 //    previous = current;
 //    current += result[0];
 //    base = previous + result[1];
 //    pos = nextPartRe.lastIndex;

 //    // continue if not a symlink
 //    if (knownHard[base] || (cache && cache[base] === base)) {
 //      continue;
 //    }

 //    var resolvedLink;
 //    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
 //      // some known symbolic link.  no need to stat again.
 //      resolvedLink = cache[base];
 //    } else {
 //      var stat = fs.lstatSync(base);
 //      if (!stat.isSymbolicLink()) {
 //        knownHard[base] = true;
 //        if (cache) cache[base] = base;
 //        continue;
 //      }

 //      fs.statSync(base);
 //      var linkTarget = fs.readlinkSync(base);
 //      resolvedLink = pathModule.resolve(previous, linkTarget);
 //      // track this, if given a cache.
 //      if (cache) cache[base] = resolvedLink;
 //    }

 //    // resolve the link, then start over
 //    p = pathModule.resolve(resolvedLink, p.slice(pos));
 //    start();
 //  }

 //  if (cache) cache[original] = p;

 //  return p;
};

fs.realpath = function realpath(p, cache, cb) {
	cb = maybeCallback(arguments[arguments.length-1]);
	if (!cache || util.isFunction(cache)) {
		cache = {};
	}

	setTimeout(function() {
		var err = null,
			res = null;
		try {
			res = fs.realpathSync(p, cache);
		} catch (e) {
			err = e;
		}
		return cb(err, res);
	}, 0);
};

fs.createReadStream = function createReadStream(path, options) {
	throw new Error('createReadStream not implemented');
};

fs.ReadStream = function ReadStream(path, options) {
	throw new Error('ReadStream not implemented');
};

fs.FileReadStream = function FileReadStream(path, options) {
	throw new Error('FileReadStream not implemented');
};

fs.createWriteStream = function createWriteStream(path, options) {
	throw new Error('createWriteStream not implemented');
};

fs.WriteStream = function WriteStream(path, options) {
	throw new Error('WriteStream not implemented');
};

fs.FileWriteStream = function FileWriteStream(path, options) {
	throw new Error('FileWriteStream not implemented');
};

// no-ops
fs.fsync = function fsync(fd, callback) { return callback(); };
fs.fsyncSync = function fsyncSync(fd) {};
fs.fchmod = function fchmod(fd, mode, callback) { return callback(); };
fs.fchmodSync = function fchmodSync(fd, mode) {};
fs.lchmod = function lchmod(path, mode, callback) { return callback(); };
fs.lchmodSync = function lchmodSync(path, mode) {};
fs.chmod = function chmod(path, mode, callback) { return callback(); };
fs.chmodSync = function chmodSync(path, mode) {};
fs.lchown = function lchown(path, uid, gid, callback) { return callback(); };
fs.lchownSync = function lchownSync(path, uid, gid) {};
fs.fchown = function fchown(fd, uid, gid, callback) { return callback(); };
fs.fchownSync = function fchownSync(fd, uid, gid) {};
fs.chown = function chown(path, uid, gid, callback) { return callback(); };
fs.chownSync = function chownSync(path, uid, gid) {};
fs.symlink = function symlink(destination, path, type_, callback) {
	return maybeCallback(arguments[arguments.length-1])();
};
fs.symlinkSync = function symlinkSync(destination, path, type) {};
fs.link = function link(srcpath, dstpath, callback) { return callback(); };
fs.linkSync = function linkSync(srcpath, dstpath) {};
fs.watch = function watch(filename) {};
fs.watchFile = function watchFile(filename) {};
fs.unwatchFile = function unwatchFile(filename, listener) {};
fs.utimes = function utimes(path, atime, mtime, callback) { return callback(); };
fs.utimesSync = function utimesSync(path, atime, mtime) {};
fs.futimes = function futimes(fd, atime, mtime, callback) { return callback(); };
fs.futimesSync = function futimesSync(fd, atime, mtime) {};

// helpers
function maybeCallback(o) {
	return o && util.isFunction(o) ? o : function(err) {
		if (err) { throw err; }
	};
}

function assertFlags(flags) {
	var tiMode = MODE_MAP[flags];
	if (tiMode == null) {
		throw new Error('Unknown file open flag: ' + flags);
	}
	return tiMode;
}

var ENCODINGS = ['ascii','utf8','utf-8','base64','binary'];
function assertEncoding(encoding) {
	if (encoding && ENCODINGS.indexOf(encoding.toLowerCase()) === -1) {
		throw new Error('Unknown encoding: ' + encoding);
	}
}

function convertBuffer(buffer, encoding) {
	switch(encoding.toLowerCase()) {
		case 'ascii':
		case 'binary':
			var ret = '';
			for (var i = 0; i < buffer.length; i++) {
				ret += String.fromCharCode(Ti.Codec.decodeNumber({
					source: buffer,
					type: Ti.Codec.TYPE_BYTE,
					position: i
				}));
			}
			return ret;
		case 'utf8':
		case 'utf-8':
			return buffer.toString();
		case 'base64':
			return Ti.Utils.base64encode(buffer.toString()).toString();
		default:
			throw new Error('Unknown encoding: ' + encoding);
	}
}

},{"util":4}]},{},[5])(5);