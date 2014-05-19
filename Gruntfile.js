'use strict';


module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    app: 'src',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      mCAPClient: {
        files: [
          '<%= yeoman.app %>/**/{,*/}*.js'
        ],
        tasks: ['preprocess:js']
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/**/{,*/}*.js'
      ]
    },
    preprocess : {
      js : {
        src : '<%= yeoman.app %>/mcap.js',
        dest : '<%= yeoman.dist %>/mcap.js'
      }
    },
    uglify: {
      js : {
        files: {
          '<%= yeoman.dist %>/mcap.min.js': ['<%= yeoman.dist %>/mcap.js'],
          '<%= yeoman.dist %>/mcap.angular.min.js': ['<%= yeoman.dist %>/mcap.angular.js']
        }
      }
    },
    copy: {
      mCAPAngular: {
        src: '<%= yeoman.app %>/mcap.angular.js',
        dest: '<%= yeoman.dist %>/mcap.angular.js'
      }
    },
    karma: {
      travis: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS'],
        frameworks: ['jasmine']
      }
    }
  });

  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('test', ['karma:travis']);

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('default', ['preprocess:js','copy:mCAPAngular','watch']);

  grunt.registerTask('build', ['jshint:all','preprocess:js','copy:mCAPAngular','uglify:js']);
};