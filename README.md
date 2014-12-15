# ti-fs

node.js-style `fs` for Titanium. It can serve as a drop-in replacement for node.js `fs` for use with [browserify][].

## install [![npm version](https://badge.fury.io/js/ti-fs.svg)](http://badge.fury.io/js/ti-fs)

```bash
$ npm install ti-fs
$ cp node_modules/ti-fs/ti-fs.js /path/to/project/Resources/
```

## support

![support chart](http://i.imgur.com/KNl7SB7.png)

* \* see [issue #7](https://github.com/tonylukasavage/ti-fs/issues/7) for details on `lstat` and `lstatSync`
* \*\* see [issue #6](https://github.com/tonylukasavage/ti-fs/issues/6) for details on `readlink` and `readlinkSync`
* \*\*\* see [issue #5](https://github.com/tonylukasavage/ti-fs/issues/5) for details on `realpath` and `realpathSync`

## assumptions

* All `buffer` buffers are assumed to be [Ti.Buffer][] instances, in the absence of a Titanium implementation of the node.js `buffer` module.
* All `fd` file descriptors are assumed to be [Ti.Filesystem.FileStream][] instances.

## caveats

* Titanium streams (in this case [Ti.Filesystem.FileStream][]) do not support the `position` property in any of the following functions:
	* `read | readSync`
	* `write | writeSync`
* The following encodings are not currently supported, though could be if requests are made in the issues:
	* `hex`
	* `ucs2 | ucs-2`
	* `utf16le | utf-16le`

## contribute [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

* Run all linting and tests with [grunt](http://gruntjs.com/getting-started).
* Add tests for any new implemented functionality.
* In lieu of an actual style guide, please follow the existing conventions used in the code.
* Any interface not part of the node.js `fs` module will be rejected.

[browserify]: https://github.com/substack/node-browserify
[Ti.Blob]: http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.Blob
[Ti.Buffer]: http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.Buffer
[Ti.Filesystem.FileStream]: http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.Filesystem.FileStream
[Ti.Filesystem.File.resolve()]: http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.Filesystem.File-method-resolve
