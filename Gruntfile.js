'use strict';


module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadTasks('./grunt-tasks');

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
          '<%= yeoman.app %>/modules/mcapjs-relution/mCap.relution.js',
          '<%= yeoman.app %>/modules/*/collections/*_collection.js',
          '<%= yeoman.app %>/modules/*/models/*_model.js'
        ],
        tasks: ['concat:mCapRelution']
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
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('server', [
    'shell:checkIfUpdatesAreAvailableOnMasterBranch',
    'copy:fonts',
    'clean:server',
    'compass:server',
    'configureProxies',
    'livereload-start',
    'connect:livereload',
    'concat:mCapRelution',
    'concat:mCapRelutionAngular',
    'watch'
  ]);

  grunt.registerTask('server:dist', [
    'configureProxies',
    'livereload-start',
    'connect:dist',
    'watch'
  ]);

  grunt.registerTask('server:test', [
    'configureProxies',
    'connect:dist',
    'watch:noop'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'coffee',
    'compass',
    'connect:test',
    'karma'
  ]);

  //pass parameter --env=integration to deploy on the integration machine
  //make sure you set the variable exports.svnPathIntegration='YOUR_PATH_TO_THE_INTEGRATION_SVN_DIRECTORY';
  grunt.registerTask('deploy', [
    'jshint',
    'shell:setEnvironmentByCurrentGitBranch',
    'shell:deployInfo',
    'shell:rebaseSvn',
    'shell:removeOldVersionFromSvn',
    'clean:dist',
    'compass:dist',
    'replace:bumpVersion',
    'useminPrepare',
    'imagemin',
    'htmlmin',
    'concat',
    'ngtemplates',
    'copy:dist',
    'cdnify',
    'cssmin',
    'ngmin',
    'uglify',
    'rev',
    'usemin',
    'copy:prod',
    'shell:addNewVersionToSvn',
    'clean',
    'shell:commitNewVersionToGit',
    'shell:pushNewVersionToGit'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
//    'jshint',
    'shell:setEnvironmentByCurrentGitBranch',
    'compass:dist',
    'useminPrepare',
    'imagemin',
    'htmlmin',
    'concat',
    'ngtemplates',
    'copy:dist',
    'cdnify',
    'cssmin',
    'ngmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  /* You can pass --path=path_to_custom_branding_file as an parameter to build a branded portal */
  grunt.registerTask('brandcss:build', [
    'shell:brandInfo',
    'clean:dist',
    'replace:brandCss',
    'compass:dist',
    'useminPrepare',
    'concat',
    'ngmin',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'replace:unBrandCss'
  ]);

  grunt.registerTask('default', ['build']);

  grunt.registerTask('docs', ['clean:docs', 'copy:docimages', 'ngdocs', 'connect:docs', 'watch:docs']);
};