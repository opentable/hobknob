var task = {
    options: {
        url: 'http://10.20.23.60:8081',
        repository: 'internal',
        username: 'grunt',
        password: '0pentab1e',
        version: '<%= grunt.option("buildNumber") %>'
    },
    artifacts: {
        files: [
            { src: ['package/**/*'] }
        ],
        options: {
            publish: [{
                id: 'services:featuretoggle-web-nodejs:zip',
                path: 'package/'
            }],
            fetch: [{
                id: 'services:featuretoggle-web-nodejs:zip',
                path: 'temp'
            }]
        }
    }
};

module.exports = task;