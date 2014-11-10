var fs = require('ti-fs'),
	should = require('should');
require('ti-mocha');

describe('ti-fs', function() {

	it('exports modules', function() {
		should.exist(fs);
		fs.should.be.an.Object;
	});

});

mocha.run(function() {
	Ti.API.info('[TESTS COMPLETE]');
});