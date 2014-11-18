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

	it('exports module', function() {
		should.exist(fs);
		fs.should.be.an.Object;
	});

	it('#Stats', function() {
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

	it('#readFile', function() {
		(function() { fs.readFile(); }).should.throw(/implemented/);
	});

	it('#readFileSync', function() {
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

	it('#read', function() {
		(function() { fs.read(); }).should.throw(/implemented/);
	});

	it('#readSync', function() {
		(function() { fs.readSync(); }).should.throw(/implemented/);
	});

	it('#write', function() {
		(function() { fs.write(); }).should.throw(/implemented/);
	});

	it('#writeSync', function() {
		(function() { fs.writeSync(); }).should.throw(/implemented/);
	});

	it('#rename', function() {
		(function() { fs.rename(); }).should.throw(/implemented/);
	});

	it('#renameSync', function() {
		(function() { fs.renameSync(); }).should.throw(/implemented/);
	});

	it('#truncate', function() {
		(function() { fs.truncate(); }).should.throw(/implemented/);
	});

	it('#truncateSync', function() {
		(function() { fs.truncateSync(); }).should.throw(/implemented/);
	});

	it('#ftruncate', function() {
		(function() { fs.ftruncate(); }).should.throw(/implemented/);
	});

	it('#ftruncateSync', function() {
		(function() { fs.ftruncateSync(); }).should.throw(/implemented/);
	});

	it('#rmdir', function() {
		(function() { fs.rmdir(); }).should.throw(/implemented/);
	});

	it('#rmdirSync', function() {
		(function() { fs.rmdirSync(); }).should.throw(/implemented/);
	});

	it('#fdatasync', function() {
		(function() { fs.fdatasync(); }).should.throw(/implemented/);
	});

	it('#fdatasyncSync', function() {
		(function() { fs.fdatasyncSync(); }).should.throw(/implemented/);
	});

	it('#fsync', function() {
		(function() { fs.fsync(); }).should.throw(/implemented/);
	});

	it('#fsyncSync', function() {
		(function() { fs.fsyncSync(); }).should.throw(/implemented/);
	});

	it('#mkdir', function() {
		(function() { fs.mkdir(); }).should.throw(/implemented/);
	});

	it('#mkdirSync', function() {
		(function() { fs.mkdirSync(); }).should.throw(/implemented/);
	});

	it('#readdir', function() {
		(function() { fs.readdir(); }).should.throw(/implemented/);
	});

	it('#readdirSync', function() {
		(function() { fs.readdirSync(); }).should.throw(/implemented/);
	});

	it('#fstat', function() {
		(function() { fs.fstat(); }).should.throw(/implemented/);
	});

	it('#lstat', function() {
		(function() { fs.lstat(); }).should.throw(/implemented/);
	});

	it('#stat', function() {
		(function() { fs.stat(); }).should.throw(/implemented/);
	});

	it('#fstatSync', function() {
		(function() { fs.fstatSync(); }).should.throw(/implemented/);
	});

	it('#lstatSync', function() {
		(function() { fs.lstatSync(); }).should.throw(/implemented/);
	});

	it('#statSync', function() {
		(function() { fs.statSync(); }).should.throw(/implemented/);
	});

	it('#readlink', function() {
		(function() { fs.readlink(); }).should.throw(/implemented/);
	});

	it('#readlinkSync', function() {
		(function() { fs.readlinkSync(); }).should.throw(/implemented/);
	});

	it('#symlink', function() {
		(function() { fs.symlink(); }).should.throw(/implemented/);
	});

	it('#symlinkSync', function() {
		(function() { fs.symlinkSync(); }).should.throw(/implemented/);
	});

	it('#link', function() {
		(function() { fs.link(); }).should.throw(/implemented/);
	});

	it('#linkSync', function() {
		(function() { fs.linkSync(); }).should.throw(/implemented/);
	});

	it('#unlink', function() {
		(function() { fs.unlink(); }).should.throw(/implemented/);
	});

	it('#unlinkSync', function() {
		(function() { fs.unlinkSync(); }).should.throw(/implemented/);
	});

	it('#fchmod', function() {
		(function() { fs.fchmod(); }).should.throw(/implemented/);
	});

	it('#fchmodSync', function() {
		(function() { fs.fchmodSync(); }).should.throw(/implemented/);
	});

	it('#lchmod', function() {
		(function() { fs.lchmod(); }).should.throw(/implemented/);
	});

	it('#lchmodSync', function() {
		(function() { fs.lchmodSync(); }).should.throw(/implemented/);
	});

	it('#chmod', function() {
		(function() { fs.chmod(); }).should.throw(/implemented/);
	});

	it('#chmodSync', function() {
		(function() { fs.chmodSync(); }).should.throw(/implemented/);
	});

	it('#lchown', function() {
		(function() { fs.lchown(); }).should.throw(/implemented/);
	});

	it('#lchownSync', function() {
		(function() { fs.lchownSync(); }).should.throw(/implemented/);
	});

	it('#fchown', function() {
		(function() { fs.fchown(); }).should.throw(/implemented/);
	});

	it('#fchownSync', function() {
		(function() { fs.fchownSync(); }).should.throw(/implemented/);
	});

	it('#chown', function() {
		(function() { fs.chown(); }).should.throw(/implemented/);
	});

	it('#chownSync', function() {
		(function() { fs.chownSync(); }).should.throw(/implemented/);
	});

	it('#_toUnixTimestamp', function() {
		(function() { fs._toUnixTimestamp(); }).should.throw(/implemented/);
	});

	it('#utimes', function() {
		(function() { fs.utimes(); }).should.throw(/implemented/);
	});

	it('#utimesSync', function() {
		(function() { fs.utimesSync(); }).should.throw(/implemented/);
	});

	it('#futimes', function() {
		(function() { fs.futimes(); }).should.throw(/implemented/);
	});

	it('#futimesSync', function() {
		(function() { fs.futimesSync(); }).should.throw(/implemented/);
	});

	it('#writeFile', function() {
		(function() { fs.writeFile(); }).should.throw(/implemented/);
	});

	it('#writeFileSync', function() {
		(function() { fs.writeFileSync(); }).should.throw(/implemented/);
	});

	it('#appendFile', function() {
		(function() { fs.appendFile(); }).should.throw(/implemented/);
	});

	it('#appendFileSync', function() {
		(function() { fs.appendFileSync(); }).should.throw(/implemented/);
	});

	it('#watch', function() {
		(function() { fs.watch(); }).should.throw(/implemented/);
	});

	it('#watchFile', function() {
		(function() { fs.watchFile(); }).should.throw(/implemented/);
	});

	it('#unwatchFile', function() {
		(function() { fs.unwatchFile(); }).should.throw(/implemented/);
	});

	it('#realpathSync', function() {
		(function() { fs.realpathSync(); }).should.throw(/implemented/);
	});

	it('#realpath', function() {
		(function() { fs.realpath(); }).should.throw(/implemented/);
	});

	it('#createReadStream', function() {
		(function() { fs.createReadStream(); }).should.throw(/implemented/);
	});

	it('#ReadStream', function() {
		(function() { fs.ReadStream(); }).should.throw(/implemented/);
	});

	it('#FileReadStream', function() {
		(function() { fs.FileReadStream(); }).should.throw(/implemented/);
	});

	it('#createWriteStream', function() {
		(function() { fs.createWriteStream(); }).should.throw(/implemented/);
	});

	it('#WriteStream', function() {
		(function() { fs.WriteStream(); }).should.throw(/implemented/);
	});

	it('#FileWriteStream', function() {
		(function() { fs.FileWriteStream(); }).should.throw(/implemented/);
	});

	it('#SyncWriteStream', function() {
		(function() { fs.SyncWriteStream(); }).should.throw(/implemented/);
	});

});

mocha.run(function() {
	Ti.API.info('[TESTS COMPLETE]');
});
