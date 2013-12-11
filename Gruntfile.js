(function() {
  module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    grunt.initConfig({
      bower: {
        install: {
          options: {
            copy: false
          }
        },
        uninstall: {
          options: {
            cleanBowerDir: true,
            copy: false,
            install: false
          }
        }
      },
      clean: {
        working: ['.temp/', 'dist/'],
        jslove: ['**/*.coffee', '!**/bower_components/**', '!**/node_modules/**']
      },
      coffee: {
        app: {
          files: [
            {
              cwd: '.temp/',
              src: '**/*.coffee',
              dest: '.temp/',
              expand: true,
              ext: '.js'
            }
          ],
          options: {
            sourceMap: true
          }
        },
        jslove: {
          files: [
            {
              cwd: '',
              src: ['**/*.coffee', '!**/bower_components/**', '!**/node_modules/**'],
              dest: '',
              expand: true,
              ext: '.js'
            }
          ]
        }
      },
      coffeelint: {
        app: {
          files: [
            {
              cwd: '',
              src: ['src/**/*.coffee', '!src/scripts/libs/**']
            }
          ],
          options: {
            indentation: {
              value: 1
            },
            max_line_length: {
              level: 'ignore'
            },
            no_tabs: {
              level: 'ignore'
            }
          }
        }
      },
      connect: {
        app: {
          options: {
            base: 'dist/',
            livereload: true,
            middleware: require('./middleware'),
            open: true,
            port: 0
          }
        }
      },
      copy: {
        app: {
          files: [
            {
              cwd: 'src/',
              src: '**',
              dest: '.temp/',
              expand: true
            }, {
              cwd: 'bower_components/angular/',
              src: 'angular.*',
              dest: '.temp/scripts/libs/',
              expand: true
            }, {
              cwd: 'bower_components/angular-animate/',
              src: 'angular-animate.*',
              dest: '.temp/scripts/libs/',
              expand: true
            }, {
              cwd: 'bower_components/angular-mocks/',
              src: 'angular-mocks.*',
              dest: '.temp/scripts/libs/',
              expand: true
            }, {
              cwd: 'bower_components/angular-route/',
              src: 'angular-route.*',
              dest: '.temp/scripts/libs/',
              expand: true
            }, {
              cwd: 'bower_components/bootstrap/less/',
              src: '*',
              dest: '.temp/styles/',
              expand: true
            }, {
              cwd: 'bower_components/bootstrap/fonts/',
              src: '*',
              dest: '.temp/fonts/',
              expand: true
            }, {
              cwd: 'bower_components/html5shiv/dist/',
              src: 'html5shiv-printshiv.js',
              dest: '.temp/scripts/libs/',
              expand: true
            }, {
              cwd: 'bower_components/json3/lib/',
              src: 'json3.min.js',
              dest: '.temp/scripts/libs/',
              expand: true
            }, {
              cwd: 'bower_components/requirejs/',
              src: 'require.js',
              dest: '.temp/scripts/libs/',
              expand: true
            }
          ]
        },
        dev: {
          cwd: '.temp/',
          src: '**',
          dest: 'dist/',
          expand: true
        },
        prod: {
          files: [
            {
              cwd: '.temp/',
              src: '**/*.{eot,svg,ttf,woff}',
              dest: 'dist/',
              expand: true
            }, {
              cwd: '.temp/',
              src: '**/*.{gif,jpeg,jpg,png,svg,webp}',
              dest: 'dist/',
              expand: true
            }, {
              cwd: '.temp/',
              src: ['scripts/ie.min.*.js', 'scripts/scripts.min.*.js'],
              dest: 'dist/',
              expand: true
            }, {
              cwd: '.temp/',
              src: 'styles/styles.min.*.css',
              dest: 'dist/',
              expand: true
            }, {
              'dist/index.html': '.temp/index.min.html'
            }
          ]
        }
      },
      hash: {
        images: '.temp/**/*.{gif,jpeg,jpg,png,svg,webp}',
        scripts: {
          cwd: '.temp/scripts/',
          src: ['ie.min.js', 'scripts.min.js'],
          expand: true
        },
        styles: '.temp/styles/styles.min.css'
      },
      imagemin: {
        images: {
          files: [
            {
              cwd: '.temp/',
              src: '**/*.{gif,jpeg,jpg,png}',
              dest: '.temp/',
              expand: true
            }
          ],
          options: {
            optimizationLevel: 7
          }
        }
      },
      jade: {
        views: {
          cwd: '.temp/',
          src: '**/*.jade',
          dest: '.temp/',
          expand: true,
          ext: '.html',
          options: {
            pretty: true
          }
        },
        spa: {
          cwd: '.temp/',
          src: 'index.jade',
          dest: '.temp/',
          expand: true,
          ext: '.html',
          options: {
            pretty: true
          }
        }
      },
      karma: {
        unit: {
          options: {
            browsers: ['PhantomJS'],
            captureTimeout: 5000,
            colors: true,
            files: ['dist/scripts/libs/angular.js', 'dist/scripts/libs/angular-animate.js', 'dist/scripts/libs/angular-route.js', 'bower_components/angular-mocks/angular-mocks.js', 'dist/**/*.js', 'test/**/*.{coffee,js}'],
            frameworks: ['jasmine'],
            junitReporter: {
              outputFile: 'test-results.xml'
            },
            keepalive: false,
            logLevel: 'INFO',
            port: 9876,
            preprocessors: {
              '**/*.coffee': 'coffee'
            },
            reporters: ['dots', 'junit', 'progress'],
            runnerPort: 9100,
            singleRun: true
          }
        }
      },
      less: {
        app: {
          files: {
            '.temp/styles/styles.css': '.temp/styles/styles.less'
          }
        }
      },
      minifyHtml: {
        prod: {
          src: '.temp/index.html',
          ext: '.min.html',
          expand: true
        }
      },
      ngTemplateCache: {
        views: {
          files: {
            '.temp/scripts/views.js': '.temp/**/*.html'
          },
          options: {
            trim: '.temp'
          }
        }
      },
      prompt: {
        jslove: {
          options: {
            questions: [
              {
                config: 'coffee.jslove.compile',
                type: 'input',
                message: 'Are you sure you wish to convert all CoffeeScript (.coffee) files to JavaScript (.js)?' + '\n' + 'This cannot be undone.'.red + ': (y/N)',
                "default": false,
                filter: function(input) {
                  var confirmed;
                  confirmed = /^y(es)?/i.test(input);
                  if (!confirmed) {
                    grunt.fatal('exiting jslove');
                  }
                  return confirmed;
                }
              }
            ]
          }
        }
      },
      requirejs: {
        scripts: {
          options: {
            baseUrl: '.temp/scripts/',
            findNestedDependencies: true,
            logLevel: 0,
            mainConfigFile: '.temp/scripts/main.js',
            name: 'main',
            onBuildWrite: function(moduleName, path, contents) {
              var modulesToExclude, shouldExcludeModule;
              modulesToExclude = ['main'];
              shouldExcludeModule = modulesToExclude.indexOf(moduleName) >= 0;
              if (shouldExcludeModule) {
                return '';
              }
              return contents;
            },
            optimize: 'uglify2',
            out: '.temp/scripts/scripts.min.js',
            preserveLicenseComments: false,
            skipModuleInsertion: true,
            uglify: {
              no_mangle: false
            },
            useStrict: true,
            wrap: {
              start: '(function(){\'use strict\';',
              end: '}).call(this);'
            }
          }
        },
        styles: {
          options: {
            baseUrl: '.temp/styles/',
            cssIn: '.temp/styles/styles.css',
            logLevel: 0,
            optimizeCss: 'standard',
            out: '.temp/styles/styles.min.css'
          }
        }
      },
      shimmer: {
        dev: {
          cwd: '.temp/scripts/',
          src: ['**/*.{coffee,js}', '!libs/angular.{coffee,js}', '!libs/angular-animate.{coffee,js}', '!libs/angular-route.{coffee,js}', '!libs/html5shiv-printshiv.{coffee,js}', '!libs/json3.min.{coffee,js}', '!libs/require.{coffee,js}'],
          order: [
            'libs/angular.min.js', {
              'NGAPP': {
                'ngAnimate': 'libs/angular-animate.min.js',
                'ngMockE2E': 'libs/angular-mocks.js',
                'ngRoute': 'libs/angular-route.min.js'
              }
            }
          ],
          require: 'NGBOOTSTRAP'
        },
        prod: {
          cwd: '<%= shimmer.dev.cwd %>',
          src: ['**/*.{coffee,js}', '!libs/angular.{coffee,js}', '!libs/angular-animate.{coffee,js}', '!libs/angular-mocks.{coffee,js}', '!libs/angular-route.{coffee,js}', '!libs/html5shiv-printshiv.{coffee,js}', '!libs/json3.min.{coffee,js}', '!libs/require.{coffee,js}', '!backend/**/*.*'],
          order: [
            'libs/angular.min.js', {
              'NGAPP': {
                'ngAnimate': 'libs/angular-animate.min.js',
                'ngRoute': 'libs/angular-route.min.js'
              }
            }
          ],
          require: '<%= shimmer.dev.require %>'
        }
      },
      template: {
        indexDev: {
          files: {
            '.temp/index.html': '.temp/index.html',
            '.temp/index.jade': '.temp/index.jade'
          }
        },
        index: {
          files: '<%= template.indexDev.files %>',
          environment: 'prod'
        }
      },
      uglify: {
        scripts: {
          files: {
            '.temp/scripts/ie.min.js': ['.temp/scripts/libs/json3.js', '.temp/scripts/libs/html5shiv-printshiv.js']
          }
        }
      },
      watch: {
        basic: {
          files: ['src/fonts/**', 'src/images/**', 'src/scripts/**/*.js', 'src/styles/**/*.css', 'src/**/*.html'],
          tasks: ['copy:app', 'copy:dev', 'karma'],
          options: {
            livereload: true,
            nospawn: true
          }
        },
        coffee: {
          files: 'src/scripts/**/*.coffee',
          tasks: ['clean:working', 'coffeelint', 'copy:app', 'shimmer:dev', 'coffee:app', 'copy:dev', 'karma'],
          options: {
            livereload: true,
            nospawn: true
          }
        },
        jade: {
          files: 'src/views/**/*.jade',
          tasks: ['copy:app', 'jade:views', 'copy:dev', 'karma'],
          options: {
            livereload: true,
            nospawn: true
          }
        },
        less: {
          files: 'src/styles/**/*.less',
          tasks: ['copy:app', 'less', 'copy:dev'],
          options: {
            livereload: true,
            nospawn: true
          }
        },
        spaHtml: {
          files: 'src/index.html',
          tasks: ['copy:app', 'template:indexDev', 'copy:dev', 'karma'],
          options: {
            livereload: true,
            nospawn: true
          }
        },
        spaJade: {
          files: 'src/index.jade',
          tasks: ['copy:app', 'template:indexDev', 'jade:spa', 'copy:dev', 'karma'],
          options: {
            livereload: true,
            nospawn: true
          }
        },
        test: {
          files: 'test/**/*.*',
          tasks: ['karma']
        },
        none: {
          files: 'none',
          options: {
            livereload: true
          }
        }
      }
    });
    grunt.event.on('watch', function(action, filepath, key) {
      var basename, coffeeConfig, coffeeLintConfig, copyDevConfig, dirname, ext, file, jadeConfig, path;
      path = require('path');
      file = filepath.substr(4);
      dirname = path.dirname(file);
      ext = path.extname(file);
      basename = path.basename(file, ext);
      grunt.config(['copy', 'app'], {
        cwd: 'src/',
        src: file,
        dest: '.temp/',
        expand: true
      });
      copyDevConfig = grunt.config(['copy', 'dev']);
      copyDevConfig.src = file;
      if (key === 'coffee') {
        grunt.config(['clean', 'working'], [path.join('.temp', dirname, "" + basename + ".{coffee,js,js.map}")]);
        copyDevConfig.src = [path.join(dirname, "" + basename + ".{coffee,js,js.map}"), 'scripts/main.{coffee,js,js.map}'];
        coffeeConfig = grunt.config(['coffee', 'app', 'files']);
        coffeeConfig.src = file;
        coffeeLintConfig = grunt.config(['coffeelint', 'app', 'files']);
        coffeeLintConfig = filepath;
        grunt.config(['coffee', 'app', 'files'], coffeeConfig);
        grunt.config(['coffeelint', 'app', 'files'], coffeeLintConfig);
      }
      if (key === 'spaJade') {
        copyDevConfig.src = path.join(dirname, "" + basename + ".{jade,html}");
      }
      if (key === 'jade') {
        copyDevConfig.src = path.join(dirname, "" + basename + ".{jade,html}");
        jadeConfig = grunt.config(['jade', 'views']);
        jadeConfig.src = file;
        grunt.config(['jade', 'views'], jadeConfig);
      }
      if (key === 'less') {
        copyDevConfig.src = [path.join(dirname, "" + basename + ".{less,css}"), path.join(dirname, 'styles.css')];
      }
      return grunt.config(['copy', 'dev'], copyDevConfig);
    });
    grunt.registerTask('build', ['clean:working', 'coffeelint', 'copy:app', 'jade', 'shimmer:dev', 'coffee:app', 'less', 'template:indexDev', 'copy:dev']);
    grunt.registerTask('default', ['build', 'connect', 'watch']);
    grunt.registerTask('dev', ['default']);
    grunt.registerTask('prod', ['clean:working', 'coffeelint', 'copy:app', 'jade:views', 'ngTemplateCache', 'shimmer:prod', 'coffee:app', 'imagemin', 'hash:images', 'less', 'requirejs', 'uglify', 'hash:scripts', 'hash:styles', 'template:index', 'jade:spa', 'minifyHtml', 'copy:prod']);
    grunt.registerTask('server', ['connect', 'watch:none']);
    grunt.registerTask('test', ['build', 'karma']);
    return grunt.registerTask('jslove', ['prompt:jslove', 'coffee:jslove', 'clean:jslove']);
  };

}).call(this);
