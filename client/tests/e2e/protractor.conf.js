var config = {
    capabilities: {
        'browserName': 'chrome',
        'version': '',
        'platform': 'ANY'
    },
    framework: 'jasmine2',
    specs: ['**/*.spec.js'],
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        isVerbose : true,
        includeStackTrace : true
    }
};

if (process.env.SAUCE_USERNAME != undefined) {
	config.sauceUser = process.env.SAUCE_USERNAME;
	config.sauceKey = process.env.SAUCE_ACCESS_KEY;
    config.capabilities = {
        'browserName': 'chrome',
        'version': '',
        'platform': 'ANY',
        'build': process.env.TRAVIS_BUILD_NUMBER,
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        'name': 'Hobknob Tests'
    };
}

exports.config = config;