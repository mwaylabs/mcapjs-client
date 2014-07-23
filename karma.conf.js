// Karma configuration
// Generated on Thu May 15 2014 13:42:58 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    plugins : [
      'karma-junit-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'bower_components/jquery/dist/*.js',
      'bower_components/underscore/underscore.js',
      'bower_components/backbone/backbone.js',
      'bower_components/uri.js/src/URI.js',
      'src/mcap.js',
      'src/utils/globals.js',
      'src/utils/utils.js',
      'src/utils/**/*.js',
      'src/filter/filterable.js',
      'src/selectable/**/*.js',
      'src/model/model.js',
      'src/model/component.js',
      'src/model/**/*.js',
      'src/collection/**/*.js',
      'src/filter/filter.js',
      'src/application/**/*.js',
      'src/security/**/*.js',

      'src/push/**/push_attribute_collection.js',
      'src/push/**/apns_provider.js',
      'src/push/**/device.js',
      'src/push/**/devices.js',
      'src/push/**/job.js',
      'src/push/**/jobs.js',
      'src/push/**/tags.js',
      'src/push/**/push_app.js',
      'src/push/**/push_apps.js',
      'src/push/**/mcap_push.js',
      'src/push/**/push_notification.js',
      'test/sinon-1.9.1.js',
      'test/**/*.js'
    ],


    // list of files to exclude
    exclude: [
      'src/mcap.angular.js',
      '**/online/**/*.*',
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
