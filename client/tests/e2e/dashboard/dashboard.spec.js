describe("Dashboard", function () {
	var protractorInstance = protractor.getInstance();
	var h1 = element(by.tagName('h1'));

	beforeEach(function() {
	    browser.get('/#!/');
	});

    it("should display title to select from menu", function() {
    	expect(h1.getText()).toEqual('Select an application from the menu');
    });

    it('should have a title', function() {
	    expect(browser.getTitle()).toEqual('Opentable Feature Toggles');
	});
});
