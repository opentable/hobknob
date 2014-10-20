var Etcd = require('node-etcd'),
    etcd = new Etcd(),
    _ = require('underscore');

describe("Delete Toggle", function () {
	var protractorInstance = protractor.getInstance();

    var deleteToggleButtonCss = '[ng-click="deleteToggle()"';

    var removeAllToggles = function(done){
        etcd.rmdir('v1', { recursive: true }, function(){
            done();
        });
    };

	beforeEach(function(done) {
        removeAllToggles(function() {
            etcd.set("v1/toggles/TestApp/TestToggle", true, function () {
                browser.get('/#!/applications/TestApp/TestToggle');
                done();
            });
        });
	});

    afterEach(function(done){
        removeAllToggles(done);
    });

    var clickDeleteToggleButton = function(){
        var deleteButton = element(by.css(deleteToggleButtonCss));
        deleteButton.click();
        deleteButton.click();
        browser.waitForAngular();
    };

    it("should delete a toggle successfully", function(){
        clickDeleteToggleButton();
        browser.get('/#!/applications/TestApp');
        expect(element.all(by.repeater('toggle in toggles')).count()).toBe(0);
    });
});
