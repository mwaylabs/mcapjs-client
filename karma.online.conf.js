// Karma configuration
// Generated on Thu May 15 2014 13:42:58 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'online.conf.js',
      'bower_components/jquery/dist/*.js',
      'bower_components/underscore/underscore.js',
      'bower_components/backbone/backbone.js',
      'src/mcap.js',
      'src/filter/filterable.js',
      'src/selectable/**/*.js',
      'src/model/**/*.js',
      'src/collection/**/*.js',
      'src/filter/filter.js',
      'src/application/**/*.js',
      'src/security/**/*.js',
      'test/sinon-1.9.1.js',
      'test/**/*.js'
    ],


    // list of files to exclude
    exclude: [
      'src/mcap.angular.js',
      'karma.conf.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
//    browsers: ['IE', 'Opera', 'PhantomJS', 'Firefox', 'Safari', 'ChromeCanary', 'Chrome'],
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
