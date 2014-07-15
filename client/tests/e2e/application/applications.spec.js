describe("Applications", function () {
	var protractorInstance = protractor.getInstance();
	var applicationTitleText = element(by.css('h3.panel-title'));

	beforeEach(function() {
	    browser.get('/#!/');
	});

	it("should display toggles when browsing to application", function() {
		browser.get('/#!/applications/protractor');
    	expect(applicationTitleText.getText()).toEqual('Feature toggles for protractor');
    });

});