'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var output = grunt.option('output');

  grunt.initConfig({
    appConfig: {
      src:'.',
      output: output || 'dist',
      home: process.env.HOME,
    },
    eslint:{
      target:[
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
      options:{
        mode:true
      },
      // Copy back-end files except test and node_modules
      services: {
        files: [{
          expand: true,
          dest: '<%= appConfig.output %>/',
          src: [
            '<%= appConfig.src %>/*.{js,json}',
            '<%= appConfig.src %>/bin/**/*',
            '<%= appConfig.src %>/routes/**/*',
            '<%= appConfig.src %>/config/**/*',
            '<%= appConfig.src %>/components/**/*',
            '<%= appConfig.src %>/views/**/*',
            '<%= appConfig.src %>/public/**/*',
            '<%= appConfig.src %>/resource/**/*',
            '<%= appConfig.src %>/template/**/*',
            '<%= appConfig.src %>/i18n/**/*',
            '<%= appConfig.src %>/resources/**/*'
          ],
        }]
      },
      // Copy nodejs modules from package.json dependencies list
      nodeModules: {
        files: [{
          expand: true,
          dot: true,
          dest: '<%= appConfig.output %>/',
          src: ['<%= appConfig.src %>/node_modules/**/*', '!<%= appConfig.src %>/node_modules/.bin/**']
        }]
      },
    },
    //API doc
    apidoc:{
      server:{
        src: ["<%= appConfig.src %>/components/", "<%= appConfig.src %>/routes/"],
        dest: "<%= appConfig.src %>/apidoc/"
      }
    },
  });

  grunt.registerTask('test', [
    'eslint',
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'clean:build',
    'copy:services',
//    'copy:nodeModules',
    'auto_install',
    'apidoc:server',
    'execute:logLine',
    'obfuscator:release'
  ]);

  grunt.registerTask('default', [
    'test',
    'build'
  ]);
};