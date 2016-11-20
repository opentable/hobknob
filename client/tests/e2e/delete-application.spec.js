var Etcd = require('node-etcd'),
  etcd = new Etcd(),
  _ = require('underscore');

describe("Delete application", function () {
  var addApplicationButtonCss = '#sidebar-wrapper .add-form > button';
  var applicationNameInputCss = '#addApplicationInput';
  var submitApplicationButtonCss = '#sidebar-wrapper .add-form form button[type=submit]';

  var deleteApplicationButtonCss = '[ng-click="deleteApplication()"]';

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

  var getApplicationLinks = function () {
    return element.all(by.css('#sidebar-wrapper > ul > li.application > a'));
  };

  var addApplication = function (newApplicationName, sleepAfterInput) {
    clickAddButton();
    enterApplicationNameAndSubmit(newApplicationName, sleepAfterInput);
  };

  var clickDeleteApplicationButton = function () {
    var deleteButton = element(by.css(deleteApplicationButtonCss));
    deleteButton.click();
    deleteButton.click();
    browser.waitForAngular();
  };

  it("should delete an application successfully", function () {
    addApplication("newTestApp");
    clickDeleteApplicationButton();

    var applicationLinks = getApplicationLinks();
    expect(applicationLinks.count()).toEqual(0);
  });
});
