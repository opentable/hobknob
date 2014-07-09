'use strict';

module.exports = function(grunt) {          

    var taskObject = {
        pkg: grunt.file.readJSON('package.json')
    };

    // Loop through the tasks in the 'grunt-tasks' folder, ignore any with an underscore at
    // the beginning, and add them to the taskObject
    // or invoke if they are functions
    grunt.file.expand('grunt-tasks/*.js', '!grunt-tasks/_*.js').forEach(function(file) {
        var name = file.split('/');
        name = name[name.length - 1].replace('.js', '');
        var task = require('./'+ file);

        if(grunt.util._.isFunction(task)){
          task(grunt);
        } else {
            taskObject[name] = task;
        }
    });

    grunt.initConfig(taskObject);

    // grunt.initConfig({
    //   ngconstant: {
    //     options: {
    //       name: 'config',
    //       dest: 'config.js',
    //       constants: {
    //         title: 'grunt-ng-constant',
    //         debug: true
    //       }
    //     },
    //     dev: {
    //       constants: {
    //         title: 'grunt-ng-constant-beta'
    //       }
    //     },
    //     prod: {
    //       constants: {
    //         debug: false
    //       }
    //     }
    //   }
    // });

    // Automatically load in all Grunt npm tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    
    grunt.registerTask('default', 'build');
    grunt.registerTask('build', ['clean:build', 'copy:build']);
    grunt.registerTask('deploy', [
        'get-artifacts',
        //'sshexec:take-app-offline',
        'wait:tenseconds',
        'sshexec:stop',
        'sshexec:make-release-dir',
        'sshexec:update-symlinks',
        'sftp:deploy',
        'sshexec:npm-update',
        'sshexec:bower-update',
        'sshexec:set-config',
        'sshexec:start',
        'wait:fiveseconds',
        // 'http:warm-up' left out for now
        // 'verify-service-status',
        //'sshexec:put-app-online',
        'wait:fiveseconds',
        'sshexec:delete-old-release-dirs',
        'clean:afterDeploy'
    ]);

};
