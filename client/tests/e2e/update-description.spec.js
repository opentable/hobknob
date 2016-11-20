var Etcd = require('node-etcd'),
  etcd = new Etcd();

describe('Update a feature description', function () {
  var descCss = '.editable';
  var editableInputCss = '.editable-input';

  var removeAllFeatures = function (done) {
    etcd.rmdir('v1', {recursive: true}, function () {
      done();
    });
  };

  beforeEach(function (done) {
    removeAllFeatures(function () {
      etcd.set('v1/metadata/TestApp/githubRepoUrl', 'https://github.com/opentable/hobknob', function () {
        etcd.set('v1/toggles/TestApp/TestFeature', false, function () {
          etcd.set('v1/metadata/TestApp/descriptions/TestFeature', 'text', function () {
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

  var getDesc = function () {
    return element(by.css(descCss));
  };

  var expectDescToHaveText = function () {
    expect(getDesc().getText()).toMatch('edited text');
  };

  it('should be able to update a description to the expected value', function () {
    getDesc().click();
    element(by.css(editableInputCss)).sendKeys('edited text');
    browser.actions().sendKeys(protractor.Key.ENTER).perform();
    expectDescToHaveText();
  });
});
