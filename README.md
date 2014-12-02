# ti-fs ![implemented 65%](http://img.shields.io/badge/implemented-65%-yellow.svg)

node.js-style `fs` for Titanium. It can serve as a drop-in replacement for node.js `fs` for use with [browserify][].

## install [![npm version](https://badge.fury.io/js/ti-fs.svg)](http://badge.fury.io/js/ti-fs)

> **NOT YET FUNCTIONAL**

```bash
$ npm install ti-fs
$ cp node_modules/ti-fs/ti-fs.js /path/to/project/Resources/
```

## assumptions

In the absence of a node.js implementation of the `buffer` module, the following assumptions are made:

* All `buffer` buffers are assumed to be [Ti.Buffer][] instances.
* All `fd` file descriptors are assumed to be [Ti.Filesystem.FileStream][] instances.
* The encoding types `binary` and `blob` return [Ti.Blob][] instances.

## caveats

* The following functions are not possible to implement with the Titanium API and are thus no-ops. While native modules might make some of this possible, there's about a 0.1% chance I'll be developing or merging any into this project:
	* `fsync | fsyncSync`
	* `link | linkSync`
	* `symlink | symlinkSync`
	* `watch | watchFile | unwatchFile`
	* `chmod | chmodSync | fchmod | fchmodSync | lchmod | lchmodSync`
	* `chown | chownSync | fchown | fchownSync | lchown | lchownSync`
* `lstat` and `lstatSync` do the same thing as `stat` and `statSync`, since Titanium doesn't make a distinction between a file and a symbolic link to a file. You can identify a symbolic link, but you can't evaluate it directly, only the file to which it links.
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
* Anything interface not part of the node.js `fs` module will be rejected.

[browserify]: https://github.com/substack/node-browserify
[Ti.Blob]: http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.Blob
[Ti.Buffer]: http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.Buffer
[Ti.Filesystem.FileStream]: http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.Filesystem.FileStream
