'use strict';

var forever = require('forever-monitor');

var child = new (forever.Monitor)('server/app.js', {
    max: -1,
    silent: false,
    options: [],
    watch: true,
    watchDirectory: './'
});

child.on('exit', function () {
    console.log('app.js has exited');
});

child.start();
