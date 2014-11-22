var fs = require('fs');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true
      },
      src: ['src/ti-fs.js', 'test/**/*.js']
    },
    browserify: {
      app: {
        files: {
          'ti-fs.js': ['src/ti-fs.js']
        }
      }
    },
    ti_run: {
      app: {
        files: {
          'tmp/app/Resources': ['ti-fs.js', 'test/app.js', 'test/file.txt',
            'node_modules/should/should.js', 'node_modules/ti-mocha/ti-mocha.js',
            'node_modules/async/lib/async.js']
        }
      }
    },
    clean: {
      src: ['tmp']
    }
  });

  // Load grunt plugins for modules
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-titanium');

  // finalize build
  grunt.registerTask('finalize', 'finalize ti-fs.js file', function() {
    var code = fs.readFileSync('ti-fs.js', 'utf8'),
      match = code.match(/\[(\d+)\]\);?\s*$/);
    fs.writeFileSync('ti-fs.js', 'module.exports=' + code.replace(/;\s*$/,'') +
      '(' + match[1] + ');');
  });

  // lint and test node and titanium
  grunt.registerTask('default', ['clean', 'jshint', 'browserify', 'finalize', 'ti_run']);

};
