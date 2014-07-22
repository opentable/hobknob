describe("Dashboard", function () {
	var protractorInstance = protractor.getInstance();
	var h1 = element(by.tagName('h1'));
	var newToggleBtn = element(by.css('.new-toggle'));
	var newToggleModal = element(by.css('.modal-title'));
	var newToggleApplicationTextBox = element(by.model('form.applicationName'));
	var newToggleToggleTextBox = element(by.model('form.toggleName'));
	var newToggleCreateBtn = element(by.css('.create-toggle-btn'));


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
