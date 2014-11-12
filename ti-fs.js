module.exports=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $F = Ti.Filesystem;

exports.Stats = function Stats() {
	throw new Error('Stats not yet implemented');
};

exports.exists = function exists(path, callback) {
	setTimeout(function() {
		return callback(exports.existsSync(path));
	}, 0);
};

exports.existsSync = function existsSync(path) {
	return $F.getFile(path).exists();
};

exports.readFile = function readFile(path, options, callback_) {
	throw new Error('readFile not yet implemented');
};

exports.readFileSync = function readFileSync(path, options) {
	throw new Error('readFileSync not yet implemented');
};

exports.close = function close(fd, callback) {
	throw new Error('close not yet implemented');
};

exports.closeSync = function closeSync(fd) {
	throw new Error('closeSync not yet implemented');
};

exports.open = function open(path, flags, mode, callback) {
	throw new Error('open not yet implemented');
};

exports.openSync = function openSync(path, flags, mode) {
	throw new Error('openSync not yet implemented');
};

exports.read = function read(fd, buffer, offset, length, position, callback) {
	throw new Error('read not yet implemented');
};

exports.readSync = function readSync(fd, buffer, offset, length, position) {
	throw new Error('readSync not yet implemented');
};

exports.write = function write(fd, buffer, offset, length, position, callback) {
	throw new Error('write not yet implemented');
};

exports.writeSync = function writeSync(fd, buffer, offset, length, position) {
	throw new Error('writeSync not yet implemented');
};

exports.rename = function rename(oldPath, newPath, callback) {
	throw new Error('rename not yet implemented');
};

exports.renameSync = function renameSync(oldPath, newPath) {
	throw new Error('renameSync not yet implemented');
};

exports.truncate = function truncate(path, len, callback) {
	throw new Error('truncate not yet implemented');
};

exports.truncateSync = function truncateSync(path, len) {
	throw new Error('truncateSync not yet implemented');
};

exports.ftruncate = function ftruncate(fd, len, callback) {
	throw new Error('ftruncate not yet implemented');
};

exports.ftruncateSync = function ftruncateSync(fd, len) {
	throw new Error('ftruncateSync not yet implemented');
};

exports.rmdir = function rmdir(path, callback) {
	throw new Error('rmdir not yet implemented');
};

exports.rmdirSync = function rmdirSync(path) {
	throw new Error('rmdirSync not yet implemented');
};

exports.fdatasync = function fdatasync(fd, callback) {
	throw new Error('fdatasync not yet implemented');
};

exports.fdatasyncSync = function fdatasyncSync(fd) {
	throw new Error('fdatasyncSync not yet implemented');
};

exports.fsync = function fsync(fd, callback) {
	throw new Error('fsync not yet implemented');
};

exports.fsyncSync = function fsyncSync(fd) {
	throw new Error('fsyncSync not yet implemented');
};

exports.mkdir = function mkdir(path, mode, callback) {
	throw new Error('mkdir not yet implemented');
};

exports.mkdirSync = function mkdirSync(path, mode) {
	throw new Error('mkdirSync not yet implemented');
};

exports.readdir = function readdir(path, callback) {
	throw new Error('readdir not yet implemented');
};

exports.readdirSync = function readdirSync(path) {
	throw new Error('readdirSync not yet implemented');
};

exports.fstat = function fstat(fd, callback) {
	throw new Error('fstat not yet implemented');
};

exports.lstat = function lstat(path, callback) {
	throw new Error('lstat not yet implemented');
};

exports.stat = function stat(path, callback) {
	throw new Error('stat not yet implemented');
};

exports.fstatSync = function fstatSync(fd) {
	throw new Error('fstatSync not yet implemented');
};

exports.lstatSync = function lstatSync(path) {
	throw new Error('lstatSync not yet implemented');
};

exports.statSync = function statSync(path) {
	throw new Error('statSync not yet implemented');
};

exports.readlink = function readlink(path, callback) {
	throw new Error('readlink not yet implemented');
};

exports.readlinkSync = function readlinkSync(path) {
	throw new Error('readlinkSync not yet implemented');
};

exports.symlink = function symlink(destination, path, type_, callback) {
	throw new Error('symlink not yet implemented');
};

exports.symlinkSync = function symlinkSync(destination, path, type) {
	throw new Error('symlinkSync not yet implemented');
};

exports.link = function link(srcpath, dstpath, callback) {
	throw new Error('link not yet implemented');
};

exports.linkSync = function linkSync(srcpath, dstpath) {
	throw new Error('linkSync not yet implemented');
};

exports.unlink = function unlink(path, callback) {
	throw new Error('unlink not yet implemented');
};

exports.unlinkSync = function unlinkSync(path) {
	throw new Error('unlinkSync not yet implemented');
};

exports.fchmod = function fchmod(fd, mode, callback) {
	throw new Error('fchmod not yet implemented');
};

exports.fchmodSync = function fchmodSync(fd, mode) {
	throw new Error('fchmodSync not yet implemented');
};

exports.lchmod = function lchmod(path, mode, callback) {
	throw new Error('lchmod not yet implemented');
};

exports.lchmodSync = function lchmodSync(path, mode) {
	throw new Error('lchmodSync not yet implemented');
};

exports.chmod = function chmod(path, mode, callback) {
	throw new Error('chmod not yet implemented');
};

exports.chmodSync = function chmodSync(path, mode) {
	throw new Error('chmodSync not yet implemented');
};

exports.lchown = function lchown(path, uid, gid, callback) {
	throw new Error('lchown not yet implemented');
};

exports.lchownSync = function lchownSync(path, uid, gid) {
	throw new Error('lchownSync not yet implemented');
};

exports.fchown = function fchown(fd, uid, gid, callback) {
	throw new Error('fchown not yet implemented');
};

exports.fchownSync = function fchownSync(fd, uid, gid) {
	throw new Error('fchownSync not yet implemented');
};

exports.chown = function chown(path, uid, gid, callback) {
	throw new Error('chown not yet implemented');
};

exports.chownSync = function chownSync(path, uid, gid) {
	throw new Error('chownSync not yet implemented');
};

exports._toUnixTimestamp = function _toUnixTimestamp(time) {
	throw new Error('_toUnixTimestamp not yet implemented');
};

exports.utimes = function utimes(path, atime, mtime, callback) {
	throw new Error('utimes not yet implemented');
};

exports.utimesSync = function utimesSync(path, atime, mtime) {
	throw new Error('utimesSync not yet implemented');
};

exports.futimes = function futimes(fd, atime, mtime, callback) {
	throw new Error('futimes not yet implemented');
};

exports.futimesSync = function futimesSync(fd, atime, mtime) {
	throw new Error('futimesSync not yet implemented');
};

exports.writeFile = function writeFile(path, data, options, callback) {
	throw new Error('writeFile not yet implemented');
};

exports.writeFileSync = function writeFileSync(path, data, options) {
	throw new Error('writeFileSync not yet implemented');
};

exports.appendFile = function appendFile(path, data, options, callback_) {
	throw new Error('appendFile not yet implemented');
};

exports.appendFileSync = function appendFileSync(path, data, options) {
	throw new Error('appendFileSync not yet implemented');
};

exports.watch = function watch(filename) {
	throw new Error('watch not yet implemented');
};

exports.watchFile = function watchFile(filename) {
	throw new Error('watchFile not yet implemented');
};

exports.unwatchFile = function unwatchFile(filename, listener) {
	throw new Error('unwatchFile not yet implemented');
};

exports.realpathSync = function realpathSync(p, cache) {
	throw new Error('realpathSync not yet implemented');
};

exports.realpath = function realpath(p, cache, cb) {
	throw new Error('realpath not yet implemented');
};

exports.createReadStream = function createReadStream(path, options) {
	throw new Error('createReadStream not yet implemented');
};

exports.ReadStream = function ReadStream(path, options) {
	throw new Error('ReadStream not yet implemented');
};

exports.FileReadStream = function FileReadStream(path, options) {
	throw new Error('FileReadStream not yet implemented');
};

exports.createWriteStream = function createWriteStream(path, options) {
	throw new Error('createWriteStream not yet implemented');
};

exports.WriteStream = function WriteStream(path, options) {
	throw new Error('WriteStream not yet implemented');
};

exports.FileWriteStream = function FileWriteStream(path, options) {
	throw new Error('FileWriteStream not yet implemented');
};

exports.SyncWriteStream = function SyncWriteStream(fd, options) {
	throw new Error('SyncWriteStream not yet implemented');
};

function maybeCallback(o) {
	return o && Object.prototype.toString.call(o) === '[object Function]' ? o : function(err) {
		if (err) { throw err; }
	};
}

},{}]},{},[1])(1);