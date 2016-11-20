var Etcd = require('node-etcd'),
  etcd = new Etcd(),
  _ = require('underscore');

describe("Saving Github Repo Url", function () {
  var githubRepoUrlInputCss = '#github-repo-url';
  var githubRepoUrlSaveButtonCss = '#save-github-repo-url';
  var alertCss = '.alert-success';

  var removeAllApps = function (done) {
    etcd.rmdir('v1', {recursive: true}, function () {
      done();
    });
  };

  beforeEach(function (done) {
    removeAllApps(function () {
      etcd.mkdir("v1/toggles/TestApp", function () {
        browser.get('/#!/applications/TestApp');
        done();
      });
    });
  });

  afterEach(function (done) {
    removeAllApps(done);
  });

  var enterGithubRepoUrlAndClickSave = function (text) {
    var githubRepoUrlInput = element(by.css(githubRepoUrlInputCss));
    var githubRepoUrlSaveButton = element(by.css(githubRepoUrlSaveButtonCss));

    githubRepoUrlInput.sendKeys(text);
    githubRepoUrlSaveButton.click();
    browser.waitForAngular();
  };

  it('should display no text when the application is created fresh', function () {
    expect(element(by.css(githubRepoUrlInputCss)).getAttribute('value')).toBe('');
  });

  it('should be able to save the Github Repo Url for this application', function () {
    enterGithubRepoUrlAndClickSave('github url');
    expect(element(by.css(alertCss)).getText()).toBe('Successfully updated the Github repo url.');
  });

  it('should show saved github repo url', function () {
    enterGithubRepoUrlAndClickSave('github url');

    browser.get('/#!/applications/TestApp');
    browser.waitForAngular();

    expect(element(by.css(githubRepoUrlInputCss)).getAttribute('value')).toBe('github url');
  });
});


