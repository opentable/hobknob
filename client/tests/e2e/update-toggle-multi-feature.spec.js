var Etcd = require('node-etcd'),
    etcd = new Etcd();

describe("Update toggle in multi feature", function () {
	var protractorInstance = protractor.getInstance();

    var switchCss = ".switch-primary.ats-switch > div";

    var removeAllFeatures = function(done){
        etcd.rmdir('v1', { recursive: true }, function(){
            done();
        });
    };

	beforeEach(function(done) {
        removeAllFeatures(function() {
            etcd.set("v1/toggles/TestApp/TestFeature/@meta", JSON.stringify({ categoryId: 1 }), function () {
                etcd.set("v1/toggles/TestApp/TestFeature/com", false, function () {
                    etcd.set("v1/toggles/TestApp/TestFeature/couk", false, function () {
                        browser.get('/#!/applications/TestApp/TestFeature');
                        done();
                    });
                });
            });
        });
	});

    afterEach(function(done){
        removeAllFeatures(done);
    });

    var getSwitch = function(toggleName){
        return element(by.css("tr[data-toggle-name='" + toggleName + "'] " + switchCss));
    };

    var expectedToggleToBeValue = function(toggleName, state){
        expect(getSwitch(toggleName).getAttribute('class')).toMatch(state ? 'switch-on' : 'switch-off');
    };

    it("should be able to set a toggle from off to on", function(){
        getSwitch('com').click();
        expectedToggleToBeValue('com', true);
        expectedToggleToBeValue('couk', false);
    });

    it("should be able to set different toggles from off to on", function(){
        getSwitch('com').click();
        getSwitch('couk').click();
        expectedToggleToBeValue('com', true);
        expectedToggleToBeValue('couk', true);
    });
    
    it("should display the correct toggle state after the browser is refreshed", function(){
        getSwitch('com').click();
        protractorInstance.refresh();
        expectedToggleToBeValue('com', true);
    });

    it("should be able to set a toggle from on to off", function(){
        getSwitch('com').click();
        getSwitch('com').click();
        expectedToggleToBeValue('com', false);
    });
});
