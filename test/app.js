var async = require('async'),
	fs = require('ti-fs'),
	should = require('should');
require('ti-mocha');

var FILE = 'file.txt';

describe('ti-fs', function() {

	before(function() {
		var src = Ti.Filesystem.getFile(FILE),
			dst = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, FILE);
		dst.write(src);
	});

	it.skip('#Stats', function() {
		(function() { fs.Stats(); }).should.throw(/implemented/);
	});

	it('#exists', function(done) {
		function test(file, value, callback) {
			fs.exists(file, function(exists) {
				exists.should.be[value];
				return callback();
			});
		}

		async.parallel([
			function(cb) { test('app.js', true, cb); },
			function(cb) { test(FILE, true, cb); },
			function(cb) { test('badfile', false, cb); },
			function(cb) { test('another/bad/file', false, cb); }
		], done);
	});

	it('#existsSync', function() {
		fs.existsSync('app.js').should.be.true;
		fs.existsSync(FILE).should.be.true;
		fs.existsSync('badfile').should.be.false;
		fs.existsSync('another/bad/file').should.be.false;
	});

	it.skip('#readFile', function() {
		(function() { fs.readFile(); }).should.throw(/implemented/);
	});

	it.skip('#readFileSync', function() {
		(function() { fs.readFileSync(); }).should.throw(/implemented/);
	});

	describe('#close', function() {

		it('errors when fd is undefined', function(done) {
			fs.close(undefined, function(err) {
				should.exist(err);
				err.message.should.match(/not an object/);
				return done();
			});
		});

		it('errors when fd is not a Ti.Filesystem.FileStream', function(done) {
			fs.close(123, function(err) {
				should.exist(err);
				err.message.should.match(/not a function/);
				return done();
			});
		});

		it('closes an open fd', function(done) {
			fs.open(FILE, 'r', function(err, fd) {
				should.not.exist(err);
				fs.close(fd, function(err) {
					should.not.exist(err);
					return done();
				});
			});
		});

	});

	describe('#closeSync', function() {

		it('errors when fd is undefined', function() {
			(function() {
				fs.closeSync();
			}).should.throw(/not an object/);
		});

		it('errors when fd is not a Ti.Filesystem.FileStream', function() {
			(function() {
				fs.closeSync(123);
			}).should.throw(/not a function/);
		});

		it('closes an fd', function() {
			(function() {
				var fd = fs.openSync(FILE, 'r');
				fs.closeSync(fd);
			}).should.not.throw();
		});

	});

	describe('#open', function() {

		it('errors on no flag', function(done) {
			fs.open(FILE, null, function(err, fd) {
				should.exist(err);
				err.message.should.match(/open flag/);
				return done();
			});
		});

		// TODO: log Titanium ticket for the less-than-stellar
		// "The iOS reported an error" error.
		it('errors on non-existent file', function(done) {
			fs.open('bad.file', 'r', function(err, fd) {
				should.exist(err);
				return done();
			});
		});

		it('opens readable fds', function(done) {
			async.each(['r', 'r+', 'rs', 'rs+'], function(flag, cb) {
				fs.open(FILE, flag, function(err, fd) {
					should.not.exist(err);
					fd.apiName.should.equal('Ti.Filesystem.FileStream');
					fd.isReadable().should.be.true;
					fd.isWritable().should.be.false;
					fs.close(fd, function(err) {
						should.not.exist(err);
						return cb();
					});
				});
			}, done);
		});

		it('opens writable fds', function(done) {
			async.each(['w', 'w+', 'wx', 'wx+', 'a', 'a+', 'ax', 'ax+'], function(flag, cb) {
				fs.open(FILE, flag, function(err, fd) {
					should.not.exist(err);
					fd.apiName.should.equal('Ti.Filesystem.FileStream');
					fd.isReadable().should.be.false;
					fd.isWritable().should.be.true;
					fs.close(fd, function(err) {
						should.not.exist(err);
						return cb();
					});
				});
			}, done);
		});

	});

	describe('#openSync', function() {

		it('errors on no flag', function() {
			(function() {
				fs.openSync(FILE);
			}).should.throw(/open flag/);
		});

		// TODO: log Titanium ticket for the less-than-stellar
		// "The iOS reported an error" error.
		it('errors on non-existent file', function() {
			(function() {
				fs.openSync('bad.file', 'r');
			}).should.throw();
		});

		it('opens readable fds', function() {
			['r', 'r+', 'rs', 'rs+'].forEach(function(flag) {
				var fd = fs.openSync(FILE, flag);
				fd.apiName.should.equal('Ti.Filesystem.FileStream');
				fd.isReadable().should.be.true;
				fd.isWritable().should.be.false;
				fs.closeSync(fd);
			});
		});

		it('opens writable fds', function() {
			['w', 'w+', 'wx', 'wx+', 'a', 'a+', 'ax', 'ax+'].forEach(function(flag) {
				var fd = fs.openSync(Ti.Filesystem.getFile(
					Ti.Filesystem.applicationDataDirectory, FILE).resolve(), flag);
				fd.apiName.should.equal('Ti.Filesystem.FileStream');
				fd.isReadable().should.be.false;
				fd.isWritable().should.be.true;
				fs.closeSync(fd);
			});
		});
	});

	it.skip('#read', function() {
		(function() { fs.read(); }).should.throw(/implemented/);
	});

	it.skip('#readSync', function() {
		(function() { fs.readSync(); }).should.throw(/implemented/);
	});

	it.skip('#write', function() {
		(function() { fs.write(); }).should.throw(/implemented/);
	});

	it.skip('#writeSync', function() {
		(function() { fs.writeSync(); }).should.throw(/implemented/);
	});

	it.skip('#rename', function() {
		(function() { fs.rename(); }).should.throw(/implemented/);
	});

	it.skip('#renameSync', function() {
		(function() { fs.renameSync(); }).should.throw(/implemented/);
	});

	it.skip('#truncate', function() {
		(function() { fs.truncate(); }).should.throw(/implemented/);
	});

	it.skip('#truncateSync', function() {
		(function() { fs.truncateSync(); }).should.throw(/implemented/);
	});

	it.skip('#ftruncate', function() {
		(function() { fs.ftruncate(); }).should.throw(/implemented/);
	});

	it.skip('#ftruncateSync', function() {
		(function() { fs.ftruncateSync(); }).should.throw(/implemented/);
	});

	it.skip('#rmdir', function() {
		(function() { fs.rmdir(); }).should.throw(/implemented/);
	});

	it.skip('#rmdirSync', function() {
		(function() { fs.rmdirSync(); }).should.throw(/implemented/);
	});

	it.skip('#fdatasync', function() {
		(function() { fs.fdatasync(); }).should.throw(/implemented/);
	});

	it.skip('#fdatasyncSync', function() {
		(function() { fs.fdatasyncSync(); }).should.throw(/implemented/);
	});

	it.skip('#fsync', function() {
		(function() { fs.fsync(); }).should.throw(/implemented/);
	});

	it.skip('#fsyncSync', function() {
		(function() { fs.fsyncSync(); }).should.throw(/implemented/);
	});

	it.skip('#mkdir', function() {
		(function() { fs.mkdir(); }).should.throw(/implemented/);
	});

	it.skip('#mkdirSync', function() {
		(function() { fs.mkdirSync(); }).should.throw(/implemented/);
	});

	it.skip('#readdir', function() {
		(function() { fs.readdir(); }).should.throw(/implemented/);
	});

	it.skip('#readdirSync', function() {
		(function() { fs.readdirSync(); }).should.throw(/implemented/);
	});

	it.skip('#fstat', function() {
		(function() { fs.fstat(); }).should.throw(/implemented/);
	});

	it.skip('#lstat', function() {
		(function() { fs.lstat(); }).should.throw(/implemented/);
	});

	it.skip('#stat', function() {
		(function() { fs.stat(); }).should.throw(/implemented/);
	});

	it.skip('#fstatSync', function() {
		(function() { fs.fstatSync(); }).should.throw(/implemented/);
	});

	it.skip('#lstatSync', function() {
		(function() { fs.lstatSync(); }).should.throw(/implemented/);
	});

	it.skip('#statSync', function() {
		(function() { fs.statSync(); }).should.throw(/implemented/);
	});

	it.skip('#readlink', function() {
		(function() { fs.readlink(); }).should.throw(/implemented/);
	});

	it.skip('#readlinkSync', function() {
		(function() { fs.readlinkSync(); }).should.throw(/implemented/);
	});

	it.skip('#symlink', function() {
		(function() { fs.symlink(); }).should.throw(/implemented/);
	});

	it.skip('#symlinkSync', function() {
		(function() { fs.symlinkSync(); }).should.throw(/implemented/);
	});

	it.skip('#link', function() {
		(function() { fs.link(); }).should.throw(/implemented/);
	});

	it.skip('#linkSync', function() {
		(function() { fs.linkSync(); }).should.throw(/implemented/);
	});

	it.skip('#unlink', function() {
		(function() { fs.unlink(); }).should.throw(/implemented/);
	});

	it.skip('#unlinkSync', function() {
		(function() { fs.unlinkSync(); }).should.throw(/implemented/);
	});

	it.skip('#fchmod', function() {
		(function() { fs.fchmod(); }).should.throw(/implemented/);
	});

	it.skip('#fchmodSync', function() {
		(function() { fs.fchmodSync(); }).should.throw(/implemented/);
	});

	it.skip('#lchmod', function() {
		(function() { fs.lchmod(); }).should.throw(/implemented/);
	});

	it.skip('#lchmodSync', function() {
		(function() { fs.lchmodSync(); }).should.throw(/implemented/);
	});

	it.skip('#chmod', function() {
		(function() { fs.chmod(); }).should.throw(/implemented/);
	});

	it.skip('#chmodSync', function() {
		(function() { fs.chmodSync(); }).should.throw(/implemented/);
	});

	it.skip('#lchown', function() {
		(function() { fs.lchown(); }).should.throw(/implemented/);
	});

	it.skip('#lchownSync', function() {
		(function() { fs.lchownSync(); }).should.throw(/implemented/);
	});

	it.skip('#fchown', function() {
		(function() { fs.fchown(); }).should.throw(/implemented/);
	});

	it.skip('#fchownSync', function() {
		(function() { fs.fchownSync(); }).should.throw(/implemented/);
	});

	it.skip('#chown', function() {
		(function() { fs.chown(); }).should.throw(/implemented/);
	});

	it.skip('#chownSync', function() {
		(function() { fs.chownSync(); }).should.throw(/implemented/);
	});

	it.skip('#_toUnixTimestamp', function() {
		(function() { fs._toUnixTimestamp(); }).should.throw(/implemented/);
	});

	it.skip('#utimes', function() {
		(function() { fs.utimes(); }).should.throw(/implemented/);
	});

	it.skip('#utimesSync', function() {
		(function() { fs.utimesSync(); }).should.throw(/implemented/);
	});

	it.skip('#futimes', function() {
		(function() { fs.futimes(); }).should.throw(/implemented/);
	});

	it.skip('#futimesSync', function() {
		(function() { fs.futimesSync(); }).should.throw(/implemented/);
	});

	it.skip('#writeFile', function() {
		(function() { fs.writeFile(); }).should.throw(/implemented/);
	});

	it.skip('#writeFileSync', function() {
		(function() { fs.writeFileSync(); }).should.throw(/implemented/);
	});

	it.skip('#appendFile', function() {
		(function() { fs.appendFile(); }).should.throw(/implemented/);
	});

	it.skip('#appendFileSync', function() {
		(function() { fs.appendFileSync(); }).should.throw(/implemented/);
	});

	it.skip('#watch', function() {
		(function() { fs.watch(); }).should.throw(/implemented/);
	});

	it.skip('#watchFile', function() {
		(function() { fs.watchFile(); }).should.throw(/implemented/);
	});

	it.skip('#unwatchFile', function() {
		(function() { fs.unwatchFile(); }).should.throw(/implemented/);
	});

	it.skip('#realpathSync', function() {
		(function() { fs.realpathSync(); }).should.throw(/implemented/);
	});

	it.skip('#realpath', function() {
		(function() { fs.realpath(); }).should.throw(/implemented/);
	});

	it.skip('#createReadStream', function() {
		(function() { fs.createReadStream(); }).should.throw(/implemented/);
	});

	it.skip('#ReadStream', function() {
		(function() { fs.ReadStream(); }).should.throw(/implemented/);
	});

	it.skip('#FileReadStream', function() {
		(function() { fs.FileReadStream(); }).should.throw(/implemented/);
	});

	it.skip('#createWriteStream', function() {
		(function() { fs.createWriteStream(); }).should.throw(/implemented/);
	});

	it.skip('#WriteStream', function() {
		(function() { fs.WriteStream(); }).should.throw(/implemented/);
	});

	it.skip('#FileWriteStream', function() {
		(function() { fs.FileWriteStream(); }).should.throw(/implemented/);
	});

	it.skip('#SyncWriteStream', function() {
		(function() { fs.SyncWriteStream(); }).should.throw(/implemented/);
	});

});

mocha.run(function() {
	Ti.API.info('[TESTS COMPLETE]');
});
