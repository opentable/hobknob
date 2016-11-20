var Etcd = require('node-etcd'),
  etcd = new Etcd();

describe("Sidebar - lists applications", function () {

  var removeAllToggles = function (done) {
    etcd.rmdir('v1', {recursive: true}, function () {
      done();
    });
  };

  beforeEach(function (done) {
    removeAllToggles(function () {
      etcd.mkdir('v1/toggles/testApp1', function () {
        etcd.mkdir('v1/toggles/testApp2', function () {
          browser.get('/#!/');
          done();
        });
      });
    });
  });

  afterEach(removeAllToggles);

  var getApplicationLinks = function () {
    return element.all(by.css('#sidebar-wrapper > ul > li.application > a'));
  };

  it("should display all applications", function () {
    var applicationLinks = getApplicationLinks();
    expect(applicationLinks.count()).toEqual(2);

    expect(applicationLinks.first().getText()).toEqual('testApp1');
    expect(applicationLinks.last().getText()).toEqual('testApp2');
  });

  it("should have application links that link to the application section", function () {
    var link = getApplicationLinks().first();
    expect(link.getAttribute('ng-href')).toEqual('/#!/applications/testApp1');
  });
});
