var $F = Ti.Filesystem,
	fs = exports,
	util = require('util');

var MODE_MAP = {};
MODE_MAP['r'] = MODE_MAP['r+'] = MODE_MAP['rs'] = MODE_MAP['rs+'] = $F.MODE_READ;
MODE_MAP['w'] = MODE_MAP['w+'] = MODE_MAP['wx'] = MODE_MAP['wx+'] = $F.MODE_WRITE;
MODE_MAP['a'] = MODE_MAP['a+'] = MODE_MAP['ax'] = MODE_MAP['ax+'] = $F.MODE_APPEND;

fs.Stats = function Stats() {
	throw new Error('Stats not yet implemented');
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
	throw new Error('readFile not yet implemented');
};

fs.readFileSync = function readFileSync(path, options) {
 throw new Error('readFileSync not yet implemented');
};

fs.close = function close(fd, callback) {
	setTimeout(function() {
		var err = null;
		try {
			fd.close();
		} catch (e) {
			err = e;
		}
		console.log(callback);
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
	var tiMode = MODE_MAP[flags];
	if (!tiMode) {
		throw new Error('Unknown file open flag: ' + flags);
	}
	return $F.getFile(path).open(tiMode);
};

fs.read = function read(fd, buffer, offset, length, position, callback) {
	throw new Error('read not yet implemented');
};

fs.readSync = function readSync(fd, buffer, offset, length, position) {
	throw new Error('readSync not yet implemented');
};

fs.write = function write(fd, buffer, offset, length, position, callback) {
	throw new Error('write not yet implemented');
};

fs.writeSync = function writeSync(fd, buffer, offset, length, position) {
	throw new Error('writeSync not yet implemented');
};

fs.rename = function rename(oldPath, newPath, callback) {
	throw new Error('rename not yet implemented');
};

fs.renameSync = function renameSync(oldPath, newPath) {
	throw new Error('renameSync not yet implemented');
};

fs.truncate = function truncate(path, len, callback) {
	throw new Error('truncate not yet implemented');
};

fs.truncateSync = function truncateSync(path, len) {
	throw new Error('truncateSync not yet implemented');
};

fs.ftruncate = function ftruncate(fd, len, callback) {
	throw new Error('ftruncate not yet implemented');
};

fs.ftruncateSync = function ftruncateSync(fd, len) {
	throw new Error('ftruncateSync not yet implemented');
};

fs.rmdir = function rmdir(path, callback) {
	throw new Error('rmdir not yet implemented');
};

fs.rmdirSync = function rmdirSync(path) {
	throw new Error('rmdirSync not yet implemented');
};

fs.fdatasync = function fdatasync(fd, callback) {
	throw new Error('fdatasync not yet implemented');
};

fs.fdatasyncSync = function fdatasyncSync(fd) {
	throw new Error('fdatasyncSync not yet implemented');
};

fs.fsync = function fsync(fd, callback) {
	throw new Error('fsync not yet implemented');
};

fs.fsyncSync = function fsyncSync(fd) {
	throw new Error('fsyncSync not yet implemented');
};

fs.mkdir = function mkdir(path, mode, callback) {
	throw new Error('mkdir not yet implemented');
};

fs.mkdirSync = function mkdirSync(path, mode) {
	throw new Error('mkdirSync not yet implemented');
};

fs.readdir = function readdir(path, callback) {
	throw new Error('readdir not yet implemented');
};

fs.readdirSync = function readdirSync(path) {
	throw new Error('readdirSync not yet implemented');
};

fs.fstat = function fstat(fd, callback) {
	throw new Error('fstat not yet implemented');
};

fs.lstat = function lstat(path, callback) {
	throw new Error('lstat not yet implemented');
};

fs.stat = function stat(path, callback) {
	throw new Error('stat not yet implemented');
};

fs.fstatSync = function fstatSync(fd) {
	throw new Error('fstatSync not yet implemented');
};

fs.lstatSync = function lstatSync(path) {
	throw new Error('lstatSync not yet implemented');
};

fs.statSync = function statSync(path) {
	throw new Error('statSync not yet implemented');
};

fs.readlink = function readlink(path, callback) {
	throw new Error('readlink not yet implemented');
};

fs.readlinkSync = function readlinkSync(path) {
	throw new Error('readlinkSync not yet implemented');
};

fs.symlink = function symlink(destination, path, type_, callback) {
	throw new Error('symlink not yet implemented');
};

fs.symlinkSync = function symlinkSync(destination, path, type) {
	throw new Error('symlinkSync not yet implemented');
};

fs.link = function link(srcpath, dstpath, callback) {
	throw new Error('link not yet implemented');
};

fs.linkSync = function linkSync(srcpath, dstpath) {
	throw new Error('linkSync not yet implemented');
};

fs.unlink = function unlink(path, callback) {
	throw new Error('unlink not yet implemented');
};

fs.unlinkSync = function unlinkSync(path) {
	throw new Error('unlinkSync not yet implemented');
};

fs.fchmod = function fchmod(fd, mode, callback) {
	throw new Error('fchmod not yet implemented');
};

fs.fchmodSync = function fchmodSync(fd, mode) {
	throw new Error('fchmodSync not yet implemented');
};

fs.lchmod = function lchmod(path, mode, callback) {
	throw new Error('lchmod not yet implemented');
};

fs.lchmodSync = function lchmodSync(path, mode) {
	throw new Error('lchmodSync not yet implemented');
};

fs.chmod = function chmod(path, mode, callback) {
	throw new Error('chmod not yet implemented');
};

fs.chmodSync = function chmodSync(path, mode) {
	throw new Error('chmodSync not yet implemented');
};

fs.lchown = function lchown(path, uid, gid, callback) {
	throw new Error('lchown not yet implemented');
};

fs.lchownSync = function lchownSync(path, uid, gid) {
	throw new Error('lchownSync not yet implemented');
};

fs.fchown = function fchown(fd, uid, gid, callback) {
	throw new Error('fchown not yet implemented');
};

fs.fchownSync = function fchownSync(fd, uid, gid) {
	throw new Error('fchownSync not yet implemented');
};

fs.chown = function chown(path, uid, gid, callback) {
	throw new Error('chown not yet implemented');
};

fs.chownSync = function chownSync(path, uid, gid) {
	throw new Error('chownSync not yet implemented');
};

fs._toUnixTimestamp = function _toUnixTimestamp(time) {
	throw new Error('_toUnixTimestamp not yet implemented');
};

fs.utimes = function utimes(path, atime, mtime, callback) {
	throw new Error('utimes not yet implemented');
};

fs.utimesSync = function utimesSync(path, atime, mtime) {
	throw new Error('utimesSync not yet implemented');
};

fs.futimes = function futimes(fd, atime, mtime, callback) {
	throw new Error('futimes not yet implemented');
};

fs.futimesSync = function futimesSync(fd, atime, mtime) {
	throw new Error('futimesSync not yet implemented');
};

fs.writeFile = function writeFile(path, data, options, callback) {
	throw new Error('writeFile not yet implemented');
};

fs.writeFileSync = function writeFileSync(path, data, options) {
	throw new Error('writeFileSync not yet implemented');
};

fs.appendFile = function appendFile(path, data, options, callback_) {
	throw new Error('appendFile not yet implemented');
};

fs.appendFileSync = function appendFileSync(path, data, options) {
	throw new Error('appendFileSync not yet implemented');
};

fs.watch = function watch(filename) {
	throw new Error('watch not yet implemented');
};

fs.watchFile = function watchFile(filename) {
	throw new Error('watchFile not yet implemented');
};

fs.unwatchFile = function unwatchFile(filename, listener) {
	throw new Error('unwatchFile not yet implemented');
};

fs.realpathSync = function realpathSync(p, cache) {
	throw new Error('realpathSync not yet implemented');
};

fs.realpath = function realpath(p, cache, cb) {
	throw new Error('realpath not yet implemented');
};

fs.createReadStream = function createReadStream(path, options) {
	throw new Error('createReadStream not yet implemented');
};

fs.ReadStream = function ReadStream(path, options) {
	throw new Error('ReadStream not yet implemented');
};

fs.FileReadStream = function FileReadStream(path, options) {
	throw new Error('FileReadStream not yet implemented');
};

fs.createWriteStream = function createWriteStream(path, options) {
	throw new Error('createWriteStream not yet implemented');
};

fs.WriteStream = function WriteStream(path, options) {
	throw new Error('WriteStream not yet implemented');
};

fs.FileWriteStream = function FileWriteStream(path, options) {
	throw new Error('FileWriteStream not yet implemented');
};

fs.SyncWriteStream = function SyncWriteStream(fd, options) {
	throw new Error('SyncWriteStream not yet implemented');
};

function maybeCallback(o) {
	return o && Object.prototype.toString.call(o) === '[object Function]' ? o : function(err) {
		if (err) { throw err; }
	};
}
