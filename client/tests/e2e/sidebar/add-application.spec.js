var Etcd = require('node-etcd'),
    etcd = new Etcd();

describe("Sidebar - add new application", function () {

    var protractorInstance = protractor.getInstance();
    var addApplicationButtonCss = '#sidebar-wrapper .add-form > button';
    var applicationNameInputCss = '#sidebar-wrapper .add-form form input';
    var cancelApplicationFormButtonCss = '#sidebar-wrapper .add-form form button[type=button]';
    var submitApplicationButtonCss = '#sidebar-wrapper .add-form form button[type=submit]';

    var removeAllToggles = function(done){
        etcd.rmdir('v1/toggles', { recursive: true }, function(){
            done();
        });
    };

    beforeEach(function(done) {
        removeAllToggles(function(){
            browser.get('/#!/');
            done();
        });
    });

    afterEach(removeAllToggles);

    var clickAddButton = function(){
        var addApplicationButton = element(by.css(addApplicationButtonCss));
        addApplicationButton.click();
        browser.waitForAngular();
    };

    var enterApplicationName = function(applicationName){
        var applicationNameInput = element(by.css(applicationNameInputCss));
        applicationNameInput.sendKeys(applicationName);
        browser.waitForAngular();
    };

    var clickSubmitButton = function(){
        var submitButton = element(by.css(submitApplicationButtonCss));
        submitButton.click();
        browser.waitForAngular();
    };

    var clickCancelButton = function(){
        var cancelButton = element(by.css(cancelApplicationFormButtonCss));
        cancelButton.click();
        browser.waitForAngular();
    };

    var getApplicationLinks = function(){
        return element.all(by.css('#sidebar-wrapper > ul > li.application > a'));
    };

    it("should show the add application form when the Add button is clicked", function() {
        clickAddButton();


        expect(element(by.css(addApplicationButtonCss)).isDisplayed()).toBe(false);
        expect(element(by.css(applicationNameInputCss)).isDisplayed()).toBe(true);
        expect(element(by.css(cancelApplicationFormButtonCss)).isDisplayed()).toBe(true);
        expect(element(by.css(submitApplicationButtonCss)).isDisplayed()).toBe(true);
    });

    it("should hide the add application form when the Cancel button is clicked", function() {
        clickAddButton();
        clickCancelButton();

        expect(element(by.css(addApplicationButtonCss)).isDisplayed()).toBe(true);
        expect(element(by.css(applicationNameInputCss)).isDisplayed()).toBe(false);
        expect(element(by.css(cancelApplicationFormButtonCss)).isDisplayed()).toBe(false);
        expect(element(by.css(submitApplicationButtonCss)).isDisplayed()).toBe(false);
    });

    it("should successfully add an application", function() {
        clickAddButton();
        enterApplicationName("newTestApp");
        clickSubmitButton();

        var applicationLinks = getApplicationLinks();
        expect(applicationLinks.count()).toEqual(1);
        expect(applicationLinks.first().getText()).toEqual('newTestApp');
    });

    it("should not be allowed to add the same application more than once", function() {
        clickAddButton();
        enterApplicationName("newTestApp");
        clickSubmitButton();

        clickAddButton();
        enterApplicationName("newTestApp");
        clickSubmitButton();

        var applicationLinks = getApplicationLinks();
        expect(applicationLinks.count()).toEqual(1);
        expect(applicationLinks.first().getText()).toEqual('newTestApp');
    });

    it("should be allowed to add more than one applications", function() {
        clickAddButton();
        enterApplicationName("newTestApp1");
        clickSubmitButton();

        clickAddButton();
        enterApplicationName("newTestApp2");
        clickSubmitButton();

        var applicationLinks = getApplicationLinks();
        expect(applicationLinks.count()).toEqual(2);
        expect(applicationLinks.first().getText()).toEqual('newTestApp1');
        expect(applicationLinks.last().getText()).toEqual('newTestApp2');
    });

    it("should reset the add application form after adding an application", function() {
        clickAddButton();
        enterApplicationName("newTestApp1");
        clickSubmitButton();

        expect(element(by.css(addApplicationButtonCss)).isDisplayed()).toBe(true);
        expect(element(by.css(applicationNameInputCss)).isDisplayed()).toBe(false);
        expect(element(by.css(cancelApplicationFormButtonCss)).isDisplayed()).toBe(false);
        expect(element(by.css(submitApplicationButtonCss)).isDisplayed()).toBe(false);

        clickAddButton();

        expect(element(by.css(applicationNameInputCss)).getText()).toBe('');
    });
});
