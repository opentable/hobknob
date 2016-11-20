var Etcd = require('node-etcd'),
  etcd = new Etcd();

describe("Multi toggle features", function () {
  var switchCss = ".switch-primary.ats-switch > div";
  var addToggleButtonCss = "#toggles .add-form > button";
  var selectToggleCss = "#toggles .add-form select";
  var submitAddToggleButtonCss = '#toggles .add-form form button[type="submit"]';
  var cancelAddToggleButtonCss = '#toggles .add-form form button[type="button"]';

  var removeAllFeatures = function (done) {
    etcd.rmdir('v1', {recursive: true}, function () {
      done();
    });
  };

  beforeEach(function (done) {
    removeAllFeatures(function () {
      etcd.set("v1/toggles/TestApp/TestFeature/@meta", JSON.stringify({categoryId: 1}), function () {
        etcd.set("v1/toggles/TestApp/TestFeature/com", false, function () {
          etcd.set("v1/toggles/TestApp/TestFeature/couk", false, function () {
            browser.get('/#!/applications/TestApp/TestFeature');
            done();
          });
        });
      });
    });
  });

  afterEach(function (done) {
    removeAllFeatures(done);
  });

  var expectedToggleToBeValue = function (toggleName, state) {
    expect(getSwitch(toggleName).getAttribute('class')).toMatch(state ? 'switch-on' : 'switch-off');
  };

  var clickAddToggleButton = function () {
    var addToggleButton = element(by.css(addToggleButtonCss));
    addToggleButton.click();
    browser.waitForAngular();
  };

  var selectToggle = function (toggle) {
    element(by.cssContainingText(selectToggleCss + ' option', toggle)).click();
  };

  var clickSubmitNewToggleButton = function () {
    var submitNewToggleButton = element(by.css(submitAddToggleButtonCss));
    submitNewToggleButton.click();
    browser.waitForAngular();
  };

  var clickCancelNewToggleButton = function () {
    var cancelNewToggleButton = element(by.css(cancelAddToggleButtonCss));
    cancelNewToggleButton.click();
    browser.waitForAngular();
  };

  var assertAddToggleFormIsDisplayed = function (isDisplayed) {
    expect(element(by.css(addToggleButtonCss)).isDisplayed()).toBe(!isDisplayed);
    expect(element(by.css(selectToggleCss)).isDisplayed()).toBe(isDisplayed);
    expect(element(by.css(cancelAddToggleButtonCss)).isDisplayed()).toBe(isDisplayed);
    expect(element(by.css(submitAddToggleButtonCss)).isDisplayed()).toBe(isDisplayed);
  };

  var addNewToggle = function (toggleName) {
    clickAddToggleButton();
    selectToggle(toggleName);
    clickSubmitNewToggleButton();
  };

  var assertToggleHasBeenAdded = function (toggleName) {
    expect(element(by.cssContainingText("tr > td", toggleName)).isDisplayed()).toBe(true);
  };

  var getSwitch = function (toggleName) {
    return element(by.css('.switch-primary[data-toggle="' + toggleName + '"] > div'));
  };

  var assertToggleValue = function (toggleName, expectedValue) {
    expect(getSwitch(toggleName).getAttribute('class')).toMatch(expectedValue ? 'switch-on' : 'switch-off');
  };

  var assertToggleCount = function (expectedToggleCount) {
    var toggles = element.all(by.repeater('toggle in toggles'));
    expect(toggles.count()).toBe(expectedToggleCount);
  };

  it("should show existing toggles", function () {
    assertToggleCount(2);
  });

  it("should not display the add toggle form when the page has loaded", function () {
    assertAddToggleFormIsDisplayed(false);
  });

  it("should show the add toggle form once Add Toggle is clicked", function () {
    clickAddToggleButton();
    assertAddToggleFormIsDisplayed(true);
  });

  it("should hide the add toggle form when cancel is clicked", function () {
    clickAddToggleButton();
    clickCancelNewToggleButton();
    assertAddToggleFormIsDisplayed(false);
  });

  it("should be able to add a toggle", function () {
    addNewToggle("de");
    assertToggleCount(3);
    assertToggleHasBeenAdded("de");
  });

  it("should initialise a newly added toggle with a false value", function () {
    addNewToggle("de");
    assertToggleValue("de", false);
  });

  it("should suggest a toggle when Add Toggle is clicked", function () {
    clickAddToggleButton();
    expect(element.all(by.options("toggleSuggestion for toggleSuggestion in toggleSuggestions")).first().getText()).toBe("de");
  });

  it("should only suggest toggles that don't already exist", function () {
    clickAddToggleButton();
    var suggestions = element.all(by.options("toggleSuggestion for toggleSuggestion in toggleSuggestions"));
    expect(suggestions.count()).toBe(2);
    expect(suggestions.first()).not.toBe("com");
    expect(suggestions.first()).not.toBe("couk");
    expect(suggestions.last()).not.toBe("com");
    expect(suggestions.last()).not.toBe("couk");
  });

  it("should hide the Add Toggle button where there are no more toggle suggestions", function () {
    addNewToggle("de");
    addNewToggle("fr");
    expect(element(by.css(addToggleButtonCss)).isDisplayed()).toBe(false);
  });

  it("should be able to set a toggle from off to on", function () {
    getSwitch("com").click();
    assertToggleValue("com", true);
  });

  it("should display the correct toggle state after the browser is refreshed", function () {
    getSwitch("com").click();
    browser.refresh();
    assertToggleValue("com", true);
  });

  it("should be able to set a toggle from on to off", function () {
    getSwitch("com").click();
    getSwitch("com").click();
    assertToggleValue("com", false);
  });

  it("should only change the toggle that is clicked", function () {
    getSwitch("com").click();
    assertToggleValue("com", true);
    assertToggleValue("couk", false);
  });
});
