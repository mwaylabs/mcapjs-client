'use strict';


module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadTasks('./grunt-tasks');

  // configurable paths
  var yeomanConfig = {
    app: 'app',
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
          '<%= yeoman.app %>/modules/**/{,*/}*.js',
          'spec/**/{,*/}*.js'
        ]
      },
      compass: {
        options: {
          sassDir: '<%= yeoman.app %>/styles',
          cssDir: '.tmp/styles',
          imagesDir: '<%= yeoman.app %>/images',
          javascriptsDir: '<%= yeoman.app %>/modules',
          fontsDir: '<%= yeoman.app %>/fonts',
          importPath: ['<%= yeoman.app %>/components', '<%= yeoman.app %>/modules'],
          relativeAssets: true
        },
        dist: {},
        server: {
          options: {
            debugInfo: true
          }
        }
      },
      useminPrepare: {
        relution: {
          src: ['<%= yeoman.app %>/index.html'],
          options: {
            dest: '<%= yeoman.dist %>'
          }
        },
        relutionEnrollment: {
          src: '<%= yeoman.app %>/enrollment/landingpage.html',
          options: {
            dest: '<%= yeoman.dist %>/enrollment/'
          }
        }
      },
      cdnify: {
        dist: {
          html: ['<%= yeoman.dist %>/*.html']
        }
      },
      ngmin: {
        dist: {
          files: [
            {
              expand: true,
              cwd: '.tmp/concat/modules/',
              src: 'relution.js',
              dest: '.tmp/concat/modules'
            }
          ]
        }
      },
      uglify: {
        options: {
            mangle:true //obfuscation
        }
      },
      rev: {
        dist: {
          files: {
            src: [
              '<%= yeoman.dist %>/modules/{,*/}*.js',
              '<%= yeoman.dist %>/styles/{,*/}*.css'
//            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
//              '<%= yeoman.dist %>/fonts/*'
            ]
          }
        }
      },
      copy: {
        dist: {
          files: [
            {
              expand: true,
              dot: true,
              cwd: '<%= yeoman.app %>',
              dest: '<%= yeoman.dist %>',
              src: [
                '*.{ico,txt,png}',
                '.htaccess',
                'enrollment/{,*/}*',
                'i18n/{,*/}*',
                'images/{,*/}*.{gif,webp}',
                'fonts/*'
              ]
            }
          ]
        },
        prod: {
          files: [
            { expand: true,cwd: 'dist/',src: ['**'],dest: '<%= yeoman.getDeployPath()%>'}
          ]
        },
        docimages: {
          files: [
            { expand: true, cwd: 'app/docs/images', src: ['**'], dest: 'docs/images/' }
          ]
        },
        fonts: {
          files: [
            { expand: true, cwd: '<%= yeoman.app %>/components/bootstrap-sass', src: 'fonts/**/*', dest: '<%= yeoman.app %>' },
            { expand: true, cwd: '<%= yeoman.app %>/components/font-awesome', src: 'fonts/**/*', dest: '<%= yeoman.app %>' }
          ]
        }
      },
      replace: {
        brandCss: {
          src: ['app/styles/main.scss'],
          overwrite: true,
          replacements: [
            {
              from: '@import "custom/relution";',
              to: function () {
                var path = grunt.option('path') || '';
                if (path.length > 0) {
                  return '/*BRAND CSS START*/@import "' + path + '";/*BRAND CSS END*/';
                } else {
                  return '/*BRAND CSS START*/ /*BRAND CSS END*/';
                }

              }
            }
          ]
        },
        unBrandCss: {
          src: ['app/styles/main.scss'],
          overwrite: true,
          replacements: [
            {
              from: /\/\*BRAND CSS START\*\/.*\/\*BRAND CSS END\*\//,
              to: '@import "custom/relution";'
            }
          ]
        },

        bumpVersion: {
          src: ['app/modules/common/services/config_service.js'],
          overwrite: true,                 // overwrite matched source files
          replacements: [
            {
              from: /version = '(\d+\.\d+.)(\d+)( r(\d+))?'/,
              to: function (match, index, fullText, regexMatches) {
                var minorInc = (parseInt(regexMatches[1], 10) || 0),
                  revInc = (parseInt(regexMatches[3], 10) || 0);

                if(global.environment==='integration'){
                  if(!revInc){
                    minorInc+=1;
                  }
                  revInc = '';
                } else if(global.environment==='master'){
                  revInc++;
                  revInc = ' r'+revInc;
                } else {
                  revInc = ' r'+revInc;
                }

                var version = 'version = \'' + regexMatches[0] + '' +(minorInc) + '' + revInc + '\'';
                deployOptions.version = version;
                return version;
              }
            },
            {
              from: /lastBuildTime = '\d*'/,
              to: function () {
                return 'lastBuildTime = \'' + (+new Date()) + '\'';
              }
            }
          ]
        }
      },
      ngdocs: {
        options: {
//        scripts: ['../app/components/angular/angular.min.js', '../app/modules/**/*.js'],
          html5Mode: false,
          startPage: '/tutorial'
        },
        tutorial: {
          src: ['app/docs/tutorial/*.ngdoc'],
          title: 'Tutorial'
        },
        api: {
          src: ['app/modules/**/*.js', 'app/docs/api/*.ngdoc'],
          title: 'API Documentation'
        }
      },
      ngtemplates: {
        app: {
          src: 'app/modules/**/*.html',
          dest: '<%= yeoman.dist %>/modules/relution-ui.js',
          options: {
            url: function (url) {
              return url.replace('app/', '');
            },
            bootstrap: function (module, script) {
              return 'angular.module("Relution").run(["$templateCache", function($templateCache) {' + script + '}]);';
            }
          }
        }
      },
      shell: {

        checkIfUpdatesAreAvailableOnMasterBranch:{
          options:{
            stdout:true,
            callback: function(err, stdout, stderr, cb){
              if(stdout){
                global.lastUpdateNotification = null;
              } else if(!global.lastUpdateNotification){
                grunt.task.run('shell:getLastCommitMessage');
              }
              cb();
            }
          },
          command: 'git log origin/master.. | grep $(git ls-remote origin -h refs/heads/master | grep refs/heads/master | cut -f 1)'
        },

        getLastCommitMessage:{
          options:{
            stdout:true,
            callback: function(err, stdout, stderr, cb){
              if(stdout){
                global.lastUpdateNotification = stdout;
                grunt.task.run('rlnNotify:masterUpdate');
              }
              cb();
            }
          },
          command: 'git fetch origin master; git log FETCH_HEAD $(git log origin/master -1 --pretty=%h)..HEAD^  --pretty="%an: %B" | grep Merge -v'
        },

        setEnvironmentByCurrentGitBranch: {
          options: {
            stdout: true,
            failOnError: true,
            callback: function(err, stdout, stderr, cb){
              global.environment = stdout.split('\n')[0];
              cb();
            }
          },
          command:'git rev-parse --abbrev-ref HEAD'
        },

        deployInfo: {
          options: {
            stdout: true,
            failOnError: true
          },
          command: function(){
            return [
                'echo "\n\nYou are on branch '+global.environment+'\nI\'m going to deploy to ' + getDeploymentServer(global.environment) + '\n"',
              'while true; do echo "Continue (y/n)?"; read -r yn; case $yn in [yY]* ) echo "Yippii lets go!"; break;; [nN]* ) exit 1;; * ) echo "Please answer y or n";; esac done'
            ].join('&&');
          }
        },

        brandInfo: {
          options: {
            stdout: true,
            failOnError: true
          },
          command: function(){
            return [
                'echo "\n\nPass --path=custom/custom to generate a custom branding css file. \nNow I\'m going to use the variable file ' + (grunt.option('path') || 'custom/relution') + ' to generate a custom css file\n\n"This file has to be uploaded via the portal. Remember to update it regularly to keep it up to date with the css changes of the portal!',
              'while true; do echo "Continue (y/n)?"; read -r yn; case $yn in [yY]* ) echo "Yippii lets go!"; break;; [nN]* ) exit 1;; * ) echo "Please answer y or n";; esac done'
            ].join('&&');
          }
        },

        rebaseSvn: {
          command: function () {
            return 'cd ' + getSvnPath(global.environment) + '; git svn rebase';
          }
        },

        removeOldVersionFromSvn: {
          command: function () {
            return 'cd ' + getSvnPath(global.environment) + '; git rm -rf portal';
          }
        },

        addNewVersionToSvn: {
          options: {
            stdout: true
          },
          command: function () {
            return 'echo "\n\nDeploy new Version ' + deployOptions.version + ' to SVN\n\n"; cd ' + getSvnPath(global.environment) + '; git add portal/; git commit -m "added new Version: ' + deployOptions.version + '"; git svn dcommit';
          }
        },

        commitNewVersionToGit: {
          options: {
            stdout: true
          },
          command: function () {
            return 'git commit -am "version bump. New Version is ' + deployOptions.version+'"';
          }

        },

        pushNewVersionToGit: {
          options: {
            stdout: true
          },
          command:function () {
            return 'git push origin '+global.environment+ '; echo "\n\nDeployment of version ' + deployOptions.version + ' to ' + getDeploymentServer(global.environment) + ' was sucessful!"';
          }
        }
      },
      protractor: {
        options: {
          configFile: 'protractor_conf.js',
          keepAlive: false, // If false, the grunt process stops when the test fails.
          noColor: false // If true, protractor will not use colors in its output.
        },
        all: {},
        single: {
          options: {
            args: {
              specs: ['spec/policies/android/exchange_policy_spec.js']
            }
          }
        }
      },

      rlnNotify: {
        masterUpdate: {
          options: {
            title: 'Relution - New update available',
            message: function(){
              return global.lastUpdateNotification;
            }
          }
        }
      },

      concat: {
        mCapRelution: {
          options: {
            banner: '\'use strict\';\n\n(function(){\n\n  var Relution = window.mCap.Relution || {};\n',
            process: function(src) {
                return src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1')
                          .replace(/var Relution = window\.mCap\.Relution \|\| \{\};[\n]?/g, '')
                          .replace(/window\.mCap\.Relution = Relution;[\n]?/g, '')
                          .replace(/^[/n]*\(function[ ]?\(\)[ ]?\{[\n]?/g, '')
                           .replace(/\}[ ]?\(\)[ ]?\);[\n]*$/g, '');
            },
            footer: '  window.mCap.Relution = Relution;\n\n}());'
          },
          src: [
            'app/modules/mcapjs-relution/mCap.relution.js',
            'app/modules/*/models/*_model.js',
            'app/modules/*/collections/*_collection.js'
          ],
          dest: 'app/modules/mcapjs-relution/build/mCap.relution.js'
        },
        mCapRelutionAngular: {
          options: {
            banner: '\'use strict\';\n\n(function(){\n\n',
            process: function(src) {
              return src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1')
                        .replace(/^[/n]*\(function[ ]?\(\)[ ]?\{[\n]?/g, '')
                        .replace(/\}[ ]?\(\)[ ]?\);[\n]*$/g, '');
            },
            footer: '\n\n}());'
          },
          src: [
            'app/modules/mcapjs-relution/mCap.relution.angular.js',
            'app/modules/*/models/*_model.angular.js',
            'app/modules/*/collections/*_collection.angular.js'
          ],
          dest: 'app/modules/mcapjs-relution/build/mCap.relution.angular.js'
        }
      }

    }
  );

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('updateCheckerThrottler', 'My "foo" task.', function() {
    var past = global.lastExecTimeStamp,
      now = +new Date(),
      waitTime = 5*60*1000;

    if(!past || (now-past>=waitTime)){
      grunt.task.run('shell:checkIfUpdatesAreAvailableOnMasterBranch');
      global.lastExecTimeStamp = now;
    }

  });

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