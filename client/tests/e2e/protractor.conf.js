exports.config = {
    allScriptsTimeout: 99999,
    capabilities: {
        'browserName': 'chrome'
    },
    baseUrl: 'http://127.0.0.1:3006/',
    framework: 'jasmine',
    specs: ['**/*.spec.js'],
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        isVerbose : true,
        includeStackTrace : true
    }
};