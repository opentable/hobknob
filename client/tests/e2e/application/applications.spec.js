var Etcd = require('node-etcd'),
    etcd = new Etcd();

describe("Applications", function () {
	var protractorInstance = protractor.getInstance();
	var applicationTitleText = element(by.css('h3.panel-title'));

	beforeEach(function(done) {

        etcd.set('v1/toggles/protractor/test', 'true', function(){
            etcd.set('v1/toggles/protractor/test2', 'true', function(){
                browser.get('/#!/applications/protractor', done);
                done();
            });
        });
    });

    afterEach(function(done){
        etcd.del('v1/toggles/protractor', { recursive: true }, done);
    });

	it("should display correct application toggle title", function() {
        var title = element(by.css('h3.panel-title'));
        expect(title.getText()).toEqual('Feature toggles for protractor');
    });

    it("should display all toggles", function() {
        var toggle1 = element(by.css('a[href="/#!/applications/protractor/test"]')),
            toggle2 = element(by.css('a[href="/#!/applications/protractor/test2"]'));
        expect(toggle1.getText()).toEqual('test');
        expect(toggle2.getText()).toEqual('test2');
    });
});
