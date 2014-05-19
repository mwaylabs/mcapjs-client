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
      mCapClient: {
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
        src : '<%= yeoman.app %>/mCap.js',
        dest : '<%= yeoman.dist %>/mCap.js'
      }
    },
    uglify: {
      js : {
        files: {
          '<%= yeoman.dist %>/mCap.min.js': ['<%= yeoman.dist %>/mCap.js'],
          '<%= yeoman.dist %>/mCap.angular.min.js': ['<%= yeoman.dist %>/mCap.angular.js']
        }
      }
    },
    copy: {
      mCapAngular: {
        src: '<%= yeoman.app %>/mCap.angular.js',
        dest: '<%= yeoman.dist %>/mCap.angular.js'
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

  grunt.registerTask('default', ['preprocess:js','copy:mCapAngular','watch']);

  grunt.registerTask('build', ['jshint:all','preprocess:js','copy:mCapAngular','uglify:js']);
};