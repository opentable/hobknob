describe("Dashboard", function () {
	beforeEach(function() {
	    browser.get('/#!/');
	});

    it("should display title to select from menu", function() {
    	expect(element(by.css('#page-content-wrapper h1')).getText()).toEqual('Select an application from the menu');
    });

    it('should have a title', function() {
	    expect(browser.getTitle()).toEqual('Opentable Feature Toggles');
	});
});
