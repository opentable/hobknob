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

	it('should display a success message when successfully creating a new toggle', function() {
		newToggleBtn.click();
		browser.waitForAngular();
		newToggleApplicationTextBox.sendKeys('protractor');
		newToggleToggleTextBox.sendKeys('toggle');
		newToggleCreateBtn.click();
		browser.waitForAngular();

		var successAlert = element(by.repeater('alert in alerts').row(0));

		expect(successAlert.getText()).toEqual('×\nClose\nSuccessfully created feature toggle');
	});

	it('should successfully add a new toggle', function() {
		newToggleBtn.click();
		browser.waitForAngular();
		newToggleApplicationTextBox.sendKeys('protractor');
		newToggleToggleTextBox.sendKeys('toggle');
		newToggleCreateBtn.click();
		browser.waitForAngular();

		var successAlert = element(by.repeater('alert in alerts').row(0));

		browser.get('/#!/applications/protractor');
		var toggleInApplicationView = element(by.css('a[href="/#!/applications/monkey1/woo1"]'))
		expect(toggleInApplicationView).toBeDefined();
	});

	it('should show an error message if one of the fields is not filled in', function() {
		newToggleBtn.click();
		browser.waitForAngular();
		newToggleApplicationTextBox.sendKeys('protractor');
		newToggleCreateBtn.click();
		browser.waitForAngular();

		var successAlert = element(by.repeater('alert in alerts').row(0));

		expect(successAlert.getText()).toEqual('×\nClose\nPlease enter the application name and the feature toggle name');
	});
});
