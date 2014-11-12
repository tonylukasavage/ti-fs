var fs = require('ti-fs'),
	should = require('should');
require('ti-mocha');

describe('ti-fs', function() {

	it('exports module', function() {
		should.exist(fs);
		fs.should.be.an.Object;
	});

	it('#Stats', function() {
		(function() { fs.Stats(); }).should.throw(/implemented/);
	});

	it('#exists', function() {
		(function() { fs.exists(); }).should.throw(/implemented/);
	});

	it('#existsSync', function() {
		(function() { fs.existsSync(); }).should.throw(/implemented/);
	});

	it('#readFile', function() {
		(function() { fs.readFile(); }).should.throw(/implemented/);
	});

	it('#readFileSync', function() {
		(function() { fs.readFileSync(); }).should.throw(/implemented/);
	});

	it('#close', function() {
		(function() { fs.close(); }).should.throw(/implemented/);
	});

	it('#closeSync', function() {
		(function() { fs.closeSync(); }).should.throw(/implemented/);
	});

	it('#open', function() {
		(function() { fs.open(); }).should.throw(/implemented/);
	});

	it('#openSync', function() {
		(function() { fs.openSync(); }).should.throw(/implemented/);
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
