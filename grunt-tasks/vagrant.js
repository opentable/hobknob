var shell = require('shelljs');

module.exports = function(grunt){
    // Vagrant tasks
    grunt.registerTask('vagrant-up', function(){
        shell.exec('vagrant up --provider vmware_fusion');
        grunt.option('config', 'vagrant');
        grunt.task.run(['build', 'deploy']);
    });

    grunt.registerTask('vagrant-destroy', function(){
        shell.exec('vagrant destroy -f');
    });
};