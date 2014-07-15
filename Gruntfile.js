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

    // Automatically load in all Grunt npm tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    
    grunt.registerTask('default', 'build');
    grunt.registerTask('build', ['ngconstant:development']);

};
