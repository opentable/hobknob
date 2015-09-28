var config = {
    capabilities: {
        'browserName': 'chrome',
        'version': '',
        'platform': 'ANY'
    },
    baseUrl: 'http://127.0.0.1:3006/',
    framework: 'jasmine2',
    specs: ['**/*.spec.js'],
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        isVerbose : true,
        includeStackTrace : true
    }
};

if (process.env.TRAVIS) {
	config.sauceUser = process.env.SAUCE_USERNAME;
	config.sauceKey = process.env.SAUCE_ACCESS_KEY;
    config.capabilities = {
        'browserName': 'firefox',
        'version': '',
        'platform': 'ANY',
        'build': process.env.TRAVIS_BUILD_NUMBER,
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        'name': 'Hobknob Tests'
    };
}

exports.config = config;