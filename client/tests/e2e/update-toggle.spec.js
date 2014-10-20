var Etcd = require('node-etcd'),
    etcd = new Etcd();

describe("New Toggle", function () {
	var protractorInstance = protractor.getInstance();

    var switchCss = ".switch-primary.ats-switch > div";


    var removeAllToggles = function(done){
        etcd.rmdir('v1', { recursive: true }, function(){
            done();
        });
    };

	beforeEach(function(done) {
        removeAllToggles(function() {
            etcd.set("v1/toggles/TestApp/TestToggle", false, function () {
                browser.get('/#!/applications/TestApp');
                done();
            });
        });
	});

    afterEach(function(done){
        removeAllToggles(done);
    });

    var getSwitch = function(){
        return element(by.css(switchCss));
    };

    var expectedToggleToBeValue = function(state){
        expect(getSwitch().getAttribute('class')).toMatch(state ? 'switch-on' : 'switch-off');
    };

    it("should be able to set a toggle from off to on", function(){
        getSwitch().click();
        expectedToggleToBeValue(true);
    });

    it("should display the correct toggle state after the browser is refreshed", function(){
        getSwitch().click();
        protractorInstance.refresh();
        expectedToggleToBeValue(true);
    });

    it("should be able to set a toggle from on to off", function(){
        getSwitch().click();
        getSwitch().click();
        expectedToggleToBeValue(false);
    });
});
