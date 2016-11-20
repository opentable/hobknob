var Etcd = require('node-etcd'),
  etcd = new Etcd();

describe("Update toggle in simple feature", function () {
  var removeAllFeatures = function (done) {
    etcd.rmdir('v1', {recursive: true}, function () {
      done();
    });
  };

  beforeEach(function (done) {
    removeAllFeatures(function () {
      etcd.set("v1/metadata/TestApp/githubRepoUrl", "https://github.com/opentable/hobknob", function () {
        etcd.set("v1/toggles/TestApp/TestFeature", false, function () {
          browser.get('/#!/applications/TestApp/TestFeature');
          done();
        });
      });
    });
  });

  afterEach(function (done) {
    removeAllFeatures(done);
  });

  var getSwitch = function () {
    return element(by.css(".switch-primary.toggle-switch > div"));
  };

  var expectedToggleToBeValue = function (state) {
    expect(getSwitch().getAttribute('class')).toMatch(state ? 'switch-on' : 'switch-off');
  };

  it("should be able to set a toggle from off to on", function () {
    getSwitch().click();
    expectedToggleToBeValue(true);
  });

  it("should display the correct toggle state after the browser is refreshed", function () {
    getSwitch().click();
    browser.refresh();
    expectedToggleToBeValue(true);
  });

  it("should be able to set a toggle from on to off", function () {
    getSwitch().click();
    getSwitch().click();
    expectedToggleToBeValue(false);
  });

  it("should not display the Add Toggle button", function () {
    expect(element(by.css("#toggles .add-form > button")).isDisplayed()).toBe(false);
  });

  it("should have a find your code link next to the toggle", function () {
    expect(element(by.css(".find-your-code")).getAttribute('href')).toBe("https://github.com/opentable/hobknob/search?utf8=%E2%9C%93&type=Code&q=TestFeature");
  });
});
