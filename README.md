# ti-fs ![implemented 18%](http://img.shields.io/badge/implemented-8%-red.svg)

node.js-style `fs` for Titanium. It can serve as a drop-in replacement for node.js `console` for use with [browserify][].

## install

```bash
$ npm install ti-fs
$ cp node_modules/ti-fs/ti-fs.js /path/to/project/Resources/
```

## caveats

* `lstat` and `lstatSync` do the same thing as `stat` and `statSync`, since Titanium doesn't make a distinction between a file and a symbolic link to a file. You can identify a symbolic link, but you can't evaluate it.

## contribute [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

* Run all linting and tests with [grunt](http://gruntjs.com/getting-started).
* Add tests for any new implemented functionality.
* In lieu of an actual style guide, please follow the existing conventions used in the code.
* Anything interface not part of the node.js `fs` module will be rejected.

[browserify]: https://github.com/substack/node-browserify
