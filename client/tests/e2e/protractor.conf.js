exports.config = {

	allScriptsTimeout: 99999,
 
	  // The address of a running selenium server.
	  seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
	 
	  // Capabilities to be passed to the webdriver instance.
	  capabilities: {
	    'browserName': 'chrome'
	  },
	 
	  baseUrl: 'http://127.0.0.1:3006/',
	 
	  framework: 'jasmine',
	 
	  // Spec patterns are relative to the current working directly when
	  // protractor is called.
	  specs: ['**/*.spec.js'],
	 
	  // Options to be passed to Jasmine-node.
	  jasmineNodeOpts: {
	    showColors: true,
	    defaultTimeoutInterval: 30000,
	    isVerbose : true,
	    includeStackTrace : true
	  }
};