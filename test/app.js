var async = require('async'),
	fs = require('ti-fs'),
	should = require('should');
require('ti-mocha');

var FILE = 'file.txt',
	CONTENT = 'I\'m a text file.';

describe('ti-fs', function() {

	before(function() {
		var src = Ti.Filesystem.getFile(FILE),
			dst = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, FILE);
		dst.write(src);
	});

	it('#Stats contain file attributes', function() {
		statFileTxt(new fs.Stats('file.txt'));
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

	it('#readFile', function(done) {
		async.series([
			function(callback) {
				fs.readFile('file.txt', 'utf8', function(err, data) {
					should.not.exist(err);
					data.should.equal(CONTENT);
					callback();
				});
			},
			function(callback) {
				fs.readFile('file.txt', function(err, data) {
					should.not.exist(err);
					data.apiName.should.equal('Ti.Buffer');
					data.toString().should.equal(CONTENT);
					callback();
				});
			}
		], done);
	});

	it('#readFileSync', function() {
		fs.readFileSync('file.txt', 'utf8').should.equal(CONTENT);

		var buffer = fs.readFileSync('file.txt');
		buffer.apiName.should.equal('Ti.Buffer');
		buffer.toString().should.equal(CONTENT);
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

	it('#read', function(done) {
		fs.open('file.txt', 'r', function(err, fd) {
			should.not.exist(err);
			fs.fstat(fd, function(err, stats) {
				should.not.exist(err);
				var buffer = Ti.createBuffer({ length: stats.size });
				fs.read(fd, buffer, function(err, bytes, buffer) {
					bytes.should.equal(stats.size);
					buffer.toString().should.equal(CONTENT);
					fs.close(fd, function(err) {
						should.not.exist(err);
						return done();
					});
				});
			});
		});
	});

	it('#readSync', function() {
		var fd = fs.openSync('file.txt', 'r'),
			stats = fs.fstatSync(fd),
			buffer = Ti.createBuffer({ length: stats.size }),
			bytes = fs.readSync(fd, buffer);
		fs.closeSync(fd);
		bytes.should.equal(stats.size);
		buffer.toString().should.equal(CONTENT);
	});

	it('#write', function(done) {
		var test = 'WRITETEST';
		var file = Ti.Filesystem.getFile('write.txt');
		file.createFile().should.be.true;

		var fd = fs.openSync('write.txt', 'w');
		fs.write(fd, Ti.createBuffer({value:test}), function(err, bytes, buffer) {
			should.not.exist(err);
			bytes.should.equal(test.length);
			fs.readFileSync('write.txt', 'utf8').should.equal(test);

			fs.write(fd, Ti.createBuffer({value:'foo'}), 1, 2, function(err, bytes, buffer) {
				should.not.exist(err);
				bytes.should.equal(2);
				fs.readFileSync('write.txt', 'utf8').should.equal('WRITETESToo');
				fs.closeSync(fd);
				return done();
			});
		});
	});

	it('#writeSync', function() {
		var test = 'WRITETEST';
		var file = Ti.Filesystem.getFile('writeSync.txt');
		file.createFile().should.be.true;

		var fd = fs.openSync('writeSync.txt', 'w');
		var bytes = fs.writeSync(fd, Ti.createBuffer({value:test}));
		bytes.should.equal(test.length);
		fs.readFileSync('writeSync.txt', 'utf8').should.equal(test);

		bytes = fs.writeSync(fd, Ti.createBuffer({value:'foo'}), 1, 2);
		bytes.should.equal(2);
		fs.readFileSync('writeSync.txt', 'utf8').should.equal('WRITETESToo');

		fs.closeSync(fd);
	});

	it('#rename', function(done) {
		var file = Ti.Filesystem.getFile('rename.foo');
		file.createFile();

		fs.rename('rename.foo', 'rename.bar', function(err) {
			should.not.exist(err);
			var newFile = Ti.Filesystem.getFile('rename.bar');
			newFile.exists().should.be.true;
			file.exists().should.be.false;
			return done();
		});
	});

	it('#renameSync', function() {
		var file = Ti.Filesystem.getFile('renameSync.foo');
		file.createFile();

		(function() {
			fs.renameSync('renameSync.foo', 'renameSync.bar');
		}).should.not.throw();
		var newFile = Ti.Filesystem.getFile('renameSync.bar');
		newFile.exists().should.be.true;
		file.exists().should.be.false;
	});

	it('#truncate', function(done) {
		fs.writeFileSync('truncate.txt', '1234567890');
		fs.readFileSync('truncate.txt', 'utf8').should.equal('1234567890');
		fs.truncate('truncate.txt', 4, function(err) {
			should.not.exist(err);
			fs.readFileSync('truncate.txt', 'utf8').should.equal('1234');
			fs.truncate('truncate.txt', function(err) {
				should.not.exist(err);
				fs.readFileSync('truncate.txt', 'utf8').should.equal('');
				return done();
			});
		});
	});

	it('#truncateSync', function() {
		fs.writeFileSync('truncateSync.txt', '1234567890');
		fs.readFileSync('truncateSync.txt', 'utf8').should.equal('1234567890');
		fs.truncateSync('truncateSync.txt', 4);
		fs.readFileSync('truncateSync.txt', 'utf8').should.equal('1234');
		fs.truncateSync('truncateSync.txt');
		fs.readFileSync('truncateSync.txt', 'utf8').should.equal('');
	});

	it('#ftruncate', function(done) {
		fs.writeFileSync('ftruncate.txt', '1234567890');
		fs.readFileSync('ftruncate.txt', 'utf8').should.equal('1234567890');
		var fd = fs.openSync('ftruncate.txt', 'r');
		fs.ftruncate(fd, 4, function(err) {
			should.not.exist(err);
			fs.readFileSync('ftruncate.txt', 'utf8').should.equal('1234');
			fs.ftruncate(fd, function(err) {
				should.not.exist(err);
				fs.readFileSync('ftruncate.txt', 'utf8').should.equal('');
				fs.closeSync(fd);
				return done();
			});
		});
	});

	it('#ftruncateSync', function() {
		fs.writeFileSync('ftruncateSync.txt', '1234567890');
		fs.readFileSync('ftruncateSync.txt', 'utf8').should.equal('1234567890');
		var fd = fs.openSync('ftruncateSync.txt', 'r');
		fs.ftruncateSync(fd, 4);
		fs.readFileSync('ftruncateSync.txt', 'utf8').should.equal('1234');
		fs.ftruncateSync(fd);
		fs.readFileSync('ftruncateSync.txt', 'utf8').should.equal('');
		fs.closeSync(fd);
	});

	it('#rmdir', function(done) {
		Ti.Filesystem.getFile('rmdir').createDirectory().should.be.true;
		fs.rmdir('rmdir', function(err) {
			should.not.exist(err);
			Ti.Filesystem.getFile('rmdirSync').exists().should.be.false;

			fs.rmdir('idontexist', function(err) {
				should.exist(err);
				err.should.match(/directory/);
				return done();
			});
		});
	});

	it('#rmdirSync', function() {
		Ti.Filesystem.getFile('rmdirSync').createDirectory().should.be.true;
		(function() {
			fs.rmdirSync('rmdirSync');
		}).should.not.throw();
		Ti.Filesystem.getFile('rmdirSync').exists().should.be.false;

		(function() {
			fs.rmdirSync('idontexist');
		}).should.throw(/directory/);
	});

	it('#fsync', function(done) {
		fs.fsync(null, function(err) {
			should.not.exist(err);
			return done();
		});
	});

	it('#fsyncSync', function() {
		(function() {
			should.not.exist(fs.fsyncSync());
		}).should.not.throw();
	});

	it('#mkdir', function(done) {
		fs.mkdir('mkdir', function(err) {
			should.not.exist(err);
			fs.existsSync('mkdir').should.be.true;
			fs.statSync('mkdir').isDirectory().should.be.true;

			fs.mkdir('i/cant/create/this', function(err) {
				should.exist(err);
				err.should.match(/create/);
				return done();
			});
		});
	});

	it('#mkdirSync', function() {
		(function() {
			fs.mkdirSync('mkdirSync');
		}).should.not.throw();
		fs.existsSync('mkdirSync').should.be.true;
		fs.statSync('mkdirSync').isDirectory().should.be.true;

		(function() {
			fs.mkdirSync('i/cant/create/this');
		}).should.throw(/create/);
	});

	it('#readdir', function(done) {
		fs.readdir('./', function(err, files) {
			should.not.exist(err);
			files.should.be.an.Array;
			files.should.containEql('app.js');
			files.should.containEql('ti-mocha.js');
			files.should.containEql('ti-fs.js');
			files.should.containEql('should.js');
			return done();
		});
	});

	it('#readdirSync', function() {
		var files = fs.readdirSync('./');
		files.should.be.an.Array;
		files.should.containEql('app.js');
		files.should.containEql('ti-mocha.js');
		files.should.containEql('ti-fs.js');
		files.should.containEql('should.js');
	});

	it('#fstat', function(done) {
		fs.open('file.txt', 'r', function(err, fd) {
			should.not.exist(err);
			fs.fstat(fd, function(err, stats) {
				should.not.exist(err);
				statFileTxt(stats);
				fs.close(fd, done);
			});
		});
	});

	it('#lstat', function(done) {
		fs.lstat('file.txt', function(err, stats) {
			should.not.exist(err);
			statFileTxt(stats);
			return done();
		});
	});

	it('#stat', function(done) {
		fs.stat('file.txt', function(err, stats) {
			should.not.exist(err);
			statFileTxt(stats);
			return done();
		});
	});

	it('#fstatSync', function() {
		var fd = fs.openSync('file.txt', 'r');
		statFileTxt(fs.fstatSync(fd));
		fs.closeSync(fd);

		(function() {
			fs.fstatSync(123);
		}).should.throw(/descriptor/);
	});

	it('#lstatSync', function() {
		statFileTxt(fs.lstatSync('file.txt'));

		(function() {
			fs.lstatSync('iamafakefile.bob');
		}).should.throw();
	});

	it('#statSync', function() {
		statFileTxt(fs.statSync('file.txt'));

		(function() {
			fs.statSync('iamafakefile.bob');
		}).should.throw();
	});

	it.skip('#readlink', function() {
		(function() { fs.readlink(); }).should.throw(/implemented/);
	});

	it.skip('#readlinkSync', function() {
		(function() { fs.readlinkSync(); }).should.throw(/implemented/);
	});

	it('#symlink', function(done) {
		fs.symlink(null, null, null, function(err) {
			should.not.exist(err);
			return done();
		});
	});

	it('#symlinkSync', function() {
		(function() {
			should.not.exist(fs.symlinkSync());
		}).should.not.throw();
	});

	it('#link', function(done) {
		fs.link(null, null, function(err) {
			should.not.exist(err);
			return done();
		});
	});

	it('#linkSync', function() {
		(function() {
			should.not.exist(fs.linkSync());
		}).should.not.throw();
	});

	it.skip('#unlink', function() {
		(function() { fs.unlink(); }).should.throw(/implemented/);
	});

	it.skip('#unlinkSync', function() {
		(function() { fs.unlinkSync(); }).should.throw(/implemented/);
	});

	it('#fchmod', function(done) {
		fs.fchmod(null, null, function(err) {
			should.not.exist(err);
			return done();
		});
	});

	it('#fchmodSync', function() {
		(function() {
			should.not.exist(fs.fchmodSync());
		}).should.not.throw();
	});

	it('#lchmod', function(done) {
		fs.lchmod(null, null, function(err) {
			should.not.exist(err);
			return done();
		});
	});

	it('#lchmodSync', function() {
		(function() {
			should.not.exist(fs.lchmodSync());
		}).should.not.throw();
	});

	it('#chmod', function(done) {
		fs.chmod(null, null, function(err) {
			should.not.exist(err);
			return done();
		});
	});

	it('#chmodSync', function() {
		(function() {
			should.not.exist(fs.chmodSync());
		}).should.not.throw();
	});

	it('#lchown', function(done) {
		fs.lchown(null, null, null, function(err) {
			should.not.exist(err);
			return done();
		});
	});

	it('#lchownSync', function() {
		(function() {
			should.not.exist(fs.lchownSync());
		}).should.not.throw();
	});

	it('#fchown', function(done) {
		fs.fchown(null, null, null, function(err) {
			should.not.exist(err);
			return done();
		});
	});

	it('#fchownSync', function() {
		(function() {
			should.not.exist(fs.fchownSync());
		}).should.not.throw();
	});

	it('#chown', function(done) {
		fs.chown(null, null, null, function(err) {
			should.not.exist(err);
			return done();
		});
	});

	it('#chownSync', function() {
		(function() {
			should.not.exist(fs.chownSync());
		}).should.not.throw();
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

	it('#writeFile', function(done) {
		fs.writeFile('writeFile.txt', 'test\nfoo', function(err) {
			should.not.exist(err);
			var file = Ti.Filesystem.getFile('writeFile.txt');
			file.exists().should.be.true;
			fs.readFileSync('writeFile.txt', 'utf8').should.equal('test\nfoo');

			fs.writeFile('writeFile2.txt', Ti.createBuffer({value:'blarg'}), function(err) {
				should.not.exist(err);
				file = Ti.Filesystem.getFile('writeFile2.txt');
				file.exists().should.be.true;
				fs.readFileSync('writeFile2.txt', 'utf8').should.equal('blarg');

				return done();
			});
		});
	});

	it('#writeFileSync', function() {
		fs.writeFileSync('writeFileSync.txt', 'test\nfoo');
		var file = Ti.Filesystem.getFile('writeFileSync.txt');
		file.exists().should.be.true;
		fs.readFileSync('writeFileSync.txt', 'utf8').should.equal('test\nfoo');

		fs.writeFileSync('writeFileSync2.txt', Ti.createBuffer({value:'blarg'}));
		file = Ti.Filesystem.getFile('writeFileSync2.txt');
		file.exists().should.be.true;
		fs.readFileSync('writeFileSync2.txt', 'utf8').should.equal('blarg');
	});

	it.skip('#appendFile', function() {
		(function() { fs.appendFile(); }).should.throw(/implemented/);
	});

	it.skip('#appendFileSync', function() {
		(function() { fs.appendFileSync(); }).should.throw(/implemented/);
	});

	it('#watch', function() {
		(function() {
			should.not.exist(fs.watch());
		}).should.not.throw();
	});

	it('#watchFile', function() {
		(function() {
			should.not.exist(fs.watchFile());
		}).should.not.throw();
	});

	it('#unwatchFile', function() {
		(function() {
			should.not.exist(fs.unwatchFile());
		}).should.not.throw();
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

function statFileTxt(stats) {
	stats.__file.apiName.should.equal('Ti.Filesystem.File');
	stats.dev.should.equal(0);
	stats.ino.should.equal(0);
	stats.mode.should.equal(0);
	stats.nlink.should.equal(0);
	stats.uid.should.equal(0);
	stats.gid.should.equal(0);
	stats.rdev.should.equal(0);
	stats.blksize.should.equal(4096);
	stats.blocks.should.equal(8);
	stats.size.should.equal(16);
	stats.atime.should.be.a.Date;
	stats.ctime.should.be.a.Date;
	stats.mtime.should.be.a.Date;
	stats.isDirectory().should.be.false;
	stats.isFile().should.be.true;
	stats.isBlockDevice().should.be.false;
	stats.isCharacterDevice().should.be.false;
	stats.isFIFO().should.be.false;
	stats.isSocket().should.be.false;

	if (Ti.Platform.name === 'iPhone OS') {
		stats.isSymbolicLink().should.be.true;
	} else {
		stats.isSymbolicLink().should.be.false;
	}
}
