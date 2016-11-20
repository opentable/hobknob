var Etcd = require('node-etcd'),
  etcd = new Etcd(),
  _ = require('underscore');

describe("Sidebar - add new application", function () {
  var addApplicationButtonCss = '#sidebar-wrapper .add-form > button';
  var applicationNameInputCss = '#addApplicationInput';
  var cancelApplicationFormButtonCss = '#sidebar-wrapper .add-form form button[type=button]';
  var submitApplicationButtonCss = '#sidebar-wrapper .add-form form button[type=submit]';

  var removeAllToggles = function (done) {
    etcd.rmdir('v1', {recursive: true}, function () {
      done();
    });
  };

  beforeEach(function (done) {
    removeAllToggles(function () {
      browser.get('/#!/');
      done();
    });
  });

  afterEach(removeAllToggles);

  var clickAddButton = function () {
    var addApplicationButton = element(by.css(addApplicationButtonCss));
    addApplicationButton.click();
    browser.waitForAngular();
  };

  var enterApplicationName = function (applicationName) {
    var applicationNameInput = element(by.css(applicationNameInputCss));
    applicationNameInput.sendKeys(applicationName);
  };

  var enterApplicationNameAndSubmit = function (applicationName) {
    var applicationNameInput = element(by.css(applicationNameInputCss));
    applicationNameInput.sendKeys(applicationName).then(function () {
      clickSubmitButton();
    });
  };

  var clickSubmitButton = function () {
    var submitButton = element(by.css(submitApplicationButtonCss));
    submitButton.click();
    browser.waitForAngular();
  };

  var clickCancelButton = function () {
    var cancelButton = element(by.css(cancelApplicationFormButtonCss));
    cancelButton.click();
    browser.waitForAngular();
  };

  var getApplicationLinks = function () {
    return element.all(by.css('#sidebar-wrapper > ul > li.application > a'));
  };

  var assertAddApplicationFormIsDisplayed = function (isDisplayed) {
    expect(element(by.css(addApplicationButtonCss)).isDisplayed()).toBe(!isDisplayed);
    expect(element(by.css(applicationNameInputCss)).isDisplayed()).toBe(isDisplayed);
    expect(element(by.css(cancelApplicationFormButtonCss)).isDisplayed()).toBe(isDisplayed);
    expect(element(by.css(submitApplicationButtonCss)).isDisplayed()).toBe(isDisplayed);
  };

  var addApplication = function (newApplicationName, sleepAfterInput) {
    clickAddButton();
    enterApplicationNameAndSubmit(newApplicationName, sleepAfterInput);
  };

  it("should show the add application form when the Add button is clicked", function () {
    clickAddButton();
    assertAddApplicationFormIsDisplayed(true);
  });

  it("should hide the add application form when the Cancel button is clicked", function () {
    clickAddButton();
    clickCancelButton();
    assertAddApplicationFormIsDisplayed(false);
  });

  it("should successfully add an application", function () {
    addApplication("newTestApp");

    var applicationLinks = getApplicationLinks();
    expect(applicationLinks.count()).toEqual(1);
    expect(applicationLinks.first().getText()).toEqual('newTestApp');
  });

  it("should show a newly added application when the browser is refreshed", function () {
    addApplication("newTestApp");
    browser.get('/#!/');
    var applicationLinks = getApplicationLinks();
    expect(applicationLinks.count()).toEqual(1);
    expect(applicationLinks.first().getText()).toEqual('newTestApp');
  });

  it("should not be allowed to add the same application more than once", function () {
    addApplication("newTestApp");
    addApplication("newTestApp");

    var applicationLinks = getApplicationLinks();
    expect(applicationLinks.count()).toEqual(1);
    expect(applicationLinks.first().getText()).toEqual('newTestApp');
    expect(element(by.binding("alert.message")).getText()).toBe("Application already exists");
  });

  it("should not be allowed to add the same application more than once - case insensitive", function () {
    addApplication("newTestApp");
    addApplication("NEWTestApp");

    var applicationLinks = getApplicationLinks();
    expect(applicationLinks.count()).toEqual(1);
    expect(applicationLinks.first().getText()).toEqual('newTestApp');
    expect(element(by.binding("alert.message")).getText()).toBe("Application already exists");
  });

  it("should be allowed to add more than one applications", function () {
    addApplication("newTestApp1");
    addApplication("newTestApp2");

    var applicationLinks = getApplicationLinks();
    expect(applicationLinks.count()).toEqual(2);
    expect(applicationLinks.first().getText()).toEqual('newTestApp1');
    expect(applicationLinks.last().getText()).toEqual('newTestApp2');
  });

  it("should reset the add application form after adding an application", function () {
    addApplication("newTestApp1");
    clickAddButton();

    expect(element(by.css(applicationNameInputCss)).getText()).toBe('');
  });

  if (!process.env.TRAVIS_BUILD_NUMBER) {
    it("should not accept bad application name: name with spaces", function () {
      addApplication("name with spaces", 1000);

      assertAddApplicationFormIsDisplayed(true);
      expect(element.all(by.repeater('application in applications')).count()).toBe(0);
      expect(element(by.binding("alert.message")).getText()).toBe("Application name must be alphanumeric with no spaces");
    });
  }

  _.each(["more spaces in this one", "Slash/es", "Back\\SlashesToo", "Weird@Chars"], function (badToggleName) {
    it("should not accept bad application name: " + badToggleName, function () {
      addApplication(badToggleName, 1000);

      assertAddApplicationFormIsDisplayed(true);
      expect(element.all(by.repeater('application in applications')).count()).toBe(0);
      expect(element(by.binding("alert.message")).getText()).toBe("Application name must be alphanumeric with no spaces");
    });
  });
});
