'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            build: {
                files: [
                    {expand: true, src: ['src/**'], dest: 'package/'},
                    {expand: true, src: ['config/**'], dest: 'package/'},
                    {expand: true, src: ['public/**'], dest: 'package/'},
                    {expand: true, src: ['routes/**'], dest: 'package/'},
                    {expand: true, src: ['views/**'], dest: 'package/'},
                    {src: ['app.js'], dest: 'package/', filter: 'isFile'},
                    {src: ['package.json'], dest: 'package/', filter: 'isFile'},
                    {src: ['bower.json'], dest: 'package/', filter: 'isFile'},
                    {src: ['.bowerrc'], dest: 'package/', filter: 'isFile'}
                ]
            }
        },

        ngconstant: {
            options: {
                name: 'config',
                dest: 'client/configuration/config.js',
                space: '  ',
                wrap: '{%= __ngModule %}',
                constants: {
                    ENV: require('./config/config.json')
                }
            },
            copyConfigToClient: {}
        },

        protractor: {
            options: {
                configFile: 'client/tests/e2e/protractor.conf.js',
                keepAlive: true,
                noColor: false,
                args: {
                    seleniumServerJar: 'node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-3.141.59.jar',
                    chromeDriver: 'node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_2.45'
                }
            },
            run: {}
        },

        eslint: {
            target: [
                'Gruntfile.js',
                'server/**/*.js',
                'client/**/*.js',
                '!client/public/**/*.js',
                '!client/js/common/lib/**/*.js',
                '!client/tests/**/*.js',
                '!client/configuration/**/*.js'
            ]
        },

        simplemocha: {
            test: {
                src: ['server/tests/**/*.js']
            }
        }
    });

    // Automatically load in all Grunt npm tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', 'build');
    grunt.registerTask('build', ['copyConfigToClient', 'eslint']);
    grunt.registerTask('copyConfigToClient', ['ngconstant:copyConfigToClient']);
    grunt.registerTask('test', ['eslint', 'simplemocha', 'protractor:run']);
};
