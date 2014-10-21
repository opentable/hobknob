var Etcd = require('node-etcd'),
    etcd = new Etcd(),
    _ = require('underscore');

describe("New Toggle", function () {
	var protractorInstance = protractor.getInstance();

    var addToggleButtonCss = "#add-toggle-form > button";
    var addToggleNameInputCss = "#add-toggle-form input";
    var cancelAddToggleButtonCss = "#add-toggle-form form button[type=button]";
    var submitAddToggleButtonCss = "#add-toggle-form button[type=submit]";

    var removeAllToggles = function(done){
        etcd.rmdir('v1', { recursive: true }, function(){
            done();
        });
    };

	beforeEach(function(done) {
        removeAllToggles(function() {
            etcd.mkdir("v1/toggles/TestApp", function () {
                browser.get('/#!/applications/TestApp');
                done();
            });
        });
	});

    afterEach(function(done){
        removeAllToggles(done);
    });

    var clickAddToggleButton = function(){
        var addToggleButton = element(by.css(addToggleButtonCss));
        addToggleButton.click();
        browser.waitForAngular();
    };

    var enterNewToggleName = function(newToggleName){
        var toggleNameInput = element(by.css(addToggleNameInputCss));
        toggleNameInput.sendKeys(newToggleName);
        browser.waitForAngular();
    };

    var clickSubmitNewToggleButton = function(){
        var submitNewToggleButton = element(by.css(submitAddToggleButtonCss));
        submitNewToggleButton.click();
        browser.waitForAngular();
    };

    var clickCancelNewToggleButton = function(){
        var cancelNewToggleButton = element(by.css(cancelAddToggleButtonCss));
        cancelNewToggleButton.click();
        browser.waitForAngular();
    };


    var assertAddToggleFormIsDisplayed = function(isDisplayed){
        expect(element(by.css(addToggleButtonCss)).isDisplayed()).toBe(!isDisplayed);
        expect(element(by.css(addToggleNameInputCss)).isDisplayed()).toBe(isDisplayed);
        expect(element(by.css(cancelAddToggleButtonCss)).isDisplayed()).toBe(isDisplayed);
        expect(element(by.css(submitAddToggleButtonCss)).isDisplayed()).toBe(isDisplayed);
    };

    var addNewToggle = function(newToggleName){
        clickAddToggleButton();
        enterNewToggleName(newToggleName);
        clickSubmitNewToggleButton();
    };

    var assertToggleHasBeenAdded = function(toggleName){
        var toggles = element.all(by.repeater('toggle in toggles'));
        expect(toggles.count()).toBe(1);
        expect(toggles.get(0).element(by.binding('toggle.name')).getText()).toBe(toggleName);
        expect(toggles.get(0).element(by.binding('toggle.fullPath')).getText()).toBe("http://127.0.0.1:4001/v2/keys/v1/toggles/TestApp/" + toggleName);
        expect(toggles.get(0).element(by.css('.ats-switch > div.switch-off')).isDisplayed()).toBe(true);
    };

    it("should display the New Toggle button", function(){
        expect(element(by.css("#add-toggle-form > button")).getText()).toBe("New Toggle");
        assertAddToggleFormIsDisplayed(false);
    });

    it("should show the add new toggle form when New Toggle is clicked", function(){
        clickAddToggleButton();
        assertAddToggleFormIsDisplayed(true);
    });

    it("should hide the add new toggle form when cancelling adding a toggle", function(){
        clickAddToggleButton();
        clickCancelNewToggleButton();
        assertAddToggleFormIsDisplayed(false);
    });

    it("should hide the add new toggle form when a toggle has been added", function(){
        addNewToggle("TestToggle");
        assertAddToggleFormIsDisplayed(false);
    });

    it("should display a newly added toggle once it has been added", function(){
        addNewToggle("TestToggle");
        assertToggleHasBeenAdded("TestToggle");
    });

    it("should display a newly added toggle once it has been added and the browser has been refreshed", function(){
        addNewToggle("TestToggle");
        browser.get('/#!/applications/TestApp', function(){
            assertToggleHasBeenAdded("TestToggle");
        });
    });

    it("should not allow a toggle to be created with the same name as one already", function(){
        addNewToggle("TestToggle");
        addNewToggle("TestToggle");

        assertAddToggleFormIsDisplayed(true);
        expect(element.all(by.repeater('toggle in toggles')).count()).toBe(1);
        expect(element(by.binding("alert.message")).getText()).toBe("Toggle already exists");
    });

    it("should not allow a toggle to be created with the same name as one already - case insensitive", function(){
        addNewToggle("TestToggle");
        addNewToggle("TESTToggle");

        assertAddToggleFormIsDisplayed(true);
        expect(element.all(by.repeater('toggle in toggles')).count()).toBe(1);
        expect(element(by.binding("alert.message")).getText()).toBe("Toggle already exists");
    });

    _.each(["ToggleWithNumbers123", "1StartsWithNumber", "Dots.AndMoreDot.s"], function(validToggleName){
        it("should accept a valid toggle name: " + validToggleName, function() {
            addNewToggle(validToggleName);
            assertToggleHasBeenAdded(validToggleName);
        });
    });

    _.each(["Toggle With Spaces", "Under_score", "Slash/es", "Back\\SlashesToo", "Weird@Chars"], function(invalidToggleName){
        it("should not accept a invalid toggle name: " + invalidToggleName, function(){
            addNewToggle(invalidToggleName);
            assertAddToggleFormIsDisplayed(true);
            expect(element.all(by.repeater('toggle in toggles')).count()).toBe(0);
            expect(element(by.binding("alert.message")).getText()).toBe("Toggle name must be alphanumeric with no spaces");
        });
    });
});
