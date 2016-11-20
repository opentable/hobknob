var Etcd = require('node-etcd'),
  etcd = new Etcd(),
  _ = require('underscore');

describe("Delete Feature", function () {
  var deleteFeatureButtonCss = '[ng-click="deleteFeature()"]';

  var removeAllFeatures = function (done) {
    etcd.rmdir('v1', {recursive: true}, function () {
      done();
    });
  };

  beforeEach(function (done) {
    removeAllFeatures(function () {
      etcd.set("v1/toggles/TestApp/TestFeature", true, function () {
        browser.get('/#!/applications/TestApp/TestFeature');
        done();
      });
    });
  });

  afterEach(function (done) {
    removeAllFeatures(done);
  });

  var clickDeleteFeatureButton = function () {
    var deleteButton = element(by.css(deleteFeatureButtonCss));
    deleteButton.click();
    deleteButton.click();
    browser.waitForAngular();
  };

  it("should delete a toggle successfully", function () {
    clickDeleteFeatureButton();
    browser.get('/#!/applications/TestApp');
    expect(element.all(by.repeater('feature in category.features')).count()).toBe(0);
  });
});
