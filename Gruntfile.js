'use strict';

let ext = '';
if (process.platform === 'win32') {
  ext = '.cmd';
}

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  var output = grunt.option('output');

  grunt.initConfig({
    appConfig: {
      src: '.',
      output: output || 'dist',
      home: process.env.HOME,
    },
    eslint: {
      target: [
        'app.js',
        './routes/**/*.js',
        './components/**/*.js'
      ],
      // options:{
      //   outputFile:'eslingReport'
      // }
    },
    mochaTest: {
      test: {
        options: {
          timeout: 30000,
          // reporter: 'mocha-jenkins-reporter',
          reporter: 'spec'
        },
        src: ['<%= appConfig.src %>/test/*.js']
      }
    },
    clean: {
      // Clean up output folder
      build: {
        src: [
          '<%= appConfig.output %>/**/*'
        ],
      },
      // Clean tmp files
      postBuild: {
        src: [
          '<%= appConfig.output %>/Gruntfile.js'
        ],
      },
      // Clean all output
      All: {
        src: [
          '<%= appConfig.output %>/**/*',
          '<%= appConfig.src %>/jshint-report.xml'
        ],
      }
    },
    copy: {
      options: {
        mode: true
      },
      electron: {
        files: [{
          expand: true,
          cwd: '<%= appConfig.src %>/node_modules/electron/dist',
          dest: '<%= appConfig.output %>/',
          src: [
            '**',
          ],
        }]
      },
      // Copy back-end files except test and node_modules
      services: {
        files: [{
          expand: true,
          dest: '<%= appConfig.output %>/resources/app',
          src: [
            '<%= appConfig.src %>/*.{js,json}',
            '<%= appConfig.src %>/bin/**/*',
            '<%= appConfig.src %>/certification/**/*',
            '<%= appConfig.src %>/config/**/*',
            '<%= appConfig.src %>/libs/**/*',
            '<%= appConfig.src %>/routes/**/*',
            '<%= appConfig.src %>/views/**/*',
            '<%= appConfig.src %>/public/**/*',
            '<%= appConfig.src %>/resources/**/*'
          ],
        }]
      },
      // Copy nodejs modules from package.json dependencies list
      nodeModules: {
        files: [{
          expand: true,
          dot: true,
          dest: '<%= appConfig.output %>/resources/app',
          src: ['<%= appConfig.src %>/node_modules/**/*',
            '!<%= appConfig.src %>/node_modules/.bin/**',
            '!<%= appConfig.src %>/node_modules/electron*/**',
            '!<%= appConfig.src %>/node_modules/*grunt*/**',
            '!<%= appConfig.src %>/node_modules/mocha*/**',
            '!<%= appConfig.src %>/node_modules/supertest*/**'
          ]
        }]
      },
    },
    //API doc
    apidoc: {
      server: {
        src: ["<%= appConfig.src %>/components/", "<%= appConfig.src %>/routes/"],
        dest: "<%= appConfig.src %>/apidoc/"
      }
    },
    auto_install: {
      dist: {
        options: {
          cwd: '<%= appConfig.output %>/resources/app',
          stdout: true,
          stderr: true,
          failOnError: true,
          npm: '--only=production'
        }
      }
    },
    exec: {
      ngBuild: {
        cwd: 'angular-src',
        cmd: 'ng build --prod'
      },
      electronRebuild: {
        cwd: 'node_modules/.bin',
        cmd: 'electron-rebuild' + ext + ' --module-dir ../..'
      }
    },
    rename: {
      electron: {
        files: [
          { src: ['<%= appConfig.output %>/electron.exe'], dest: '<%= appConfig.output %>/shera.exe' },
          { src: ['<%= appConfig.output %>/electron'], dest: '<%= appConfig.output %>/shera' },
        ]
      }
    }
  });

  grunt.registerTask('ngBuild', [
    'exec:ngBuild'
  ]);

  grunt.registerTask('test', [
    'eslint',
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'clean:build',
    'exec:ngBuild',
    // 'exec:electronRebuild',
    'copy:electron',
    'copy:services',
    'copy:nodeModules',
    // 'auto_install',
    // 'apidoc:server',
    'rename:electron'
  ]);

  grunt.registerTask('default', [
    'test',
    'build'
  ]);
};