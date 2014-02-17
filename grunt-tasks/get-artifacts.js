var task = function(grunt){

    var tasklist = [ 'artifactory:artifacts:fetch' ];

    // when we're deploying to a Vagrant box, don't get the artifacts from JAWS
    // just package the local files
    if(!grunt.option('config') || grunt.option('config') === 'vagrant'){
        tasklist = [ 'copy:buildOutputAsPackage' ];
    }
    else{
    	// If the build number isn't set at command line then go get it and populate it
	    if (!grunt.option('buildNumber')) {
	    	tasklist = [ 'download-last-pinned-buildnumber', 'set-buildnumber', 'artifactory:artifacts:fetch' ];
	    }
    }

    grunt.registerTask('get-artifacts', tasklist);
};

module.exports = task;
