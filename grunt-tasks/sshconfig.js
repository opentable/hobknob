var task = {
    vagrant : {
        host: "0.0.0.0",
        port: "<%= (grunt.option('port') || 2222) %>",
        username: "otdeploy",
        password: "vagrant",
        path: '/var/www/featuretoggle/current/',
        releases:'/var/www/featuretoggle/releases/',
        lbstatus: '/etc/lbstatus/featuretoggle',
        httpPort: 3006
    },
    qa: {
        host: "<%= grunt.option('server') %>",
        port: "<%= (grunt.option('port') || 22) %>",
        username: "<%= grunt.option('username') %>",
        password: "<%= grunt.option('password') %>",
        path: '/var/www/restaurant/current/',
        releases:'/var/www/restaurant/releases/',
        lbstatus: '/etc/lbstatus/restaurant',
        httpPort: 80
    },
    ci: {
        host: "<%= grunt.option('server') %>",
        port: "<%= (grunt.option('port') || 22) %>",
        username: "<%= grunt.option('username') %>",
        password: "<%= grunt.option('password') %>",
        path: '/var/www/restaurant/current/',
        releases:'/var/www/restaurant/releases/',
        lbstatus: '/etc/lbstatus/restaurant',
        httpPort: 80
    },
    'pre-prod': {
        host: "<%= grunt.option('server') %>",
        port: "<%= (grunt.option('port') || 22) %>",
        username: "<%= grunt.option('username') %>",
        password: "<%= grunt.option('password') %>",
        path: '/var/www/restaurant/current/',
        releases:'/var/www/restaurant/releases/',
        lbstatus: '/etc/lbstatus/restaurant',
        httpPort: 80
    },
    'production-na': {
        host: "<%= grunt.option('server') %>",
        port: "<%= (grunt.option('port') || 22) %>",
        username: "<%= grunt.option('username') %>",
        password: "<%= grunt.option('password') %>",
        path: '/var/www/restaurant/current/',
        releases:'/var/www/restaurant/releases/',
        lbstatus: '/etc/lbstatus/restaurant',
        httpPort: 80
    },
    'production-eu': {
        host: "<%= grunt.option('server') %>",
        port: "<%= (grunt.option('port') || 22) %>",
        username: "<%= grunt.option('username') %>",
        password: "<%= grunt.option('password') %>",
        path: '/var/www/restaurant/current/',
        releases:'/var/www/restaurant/releases/',
        lbstatus: '/etc/lbstatus/restaurant',
        httpPort: 80
    }
}

module.exports = task;
