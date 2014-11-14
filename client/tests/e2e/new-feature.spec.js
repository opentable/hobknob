var Etcd = require('node-etcd'),
    etcd = new Etcd(),
    _ = require('underscore');

_.each([0, 1], function(categoryId){
    describe("New Feature. CategoryId: " + categoryId, function () {
        var protractorInstance = protractor.getInstance();

        var categoryPanelCss = ".panel[data-category-id='" + categoryId + "'] ";
        var addFeatureButtonCss = categoryPanelCss + ".add-form > button";
        var addFeatureNameInputCss = categoryPanelCss + ".add-form input";
        var cancelAddFeatureButtonCss = categoryPanelCss + ".add-form form button[type=button]";
        var submitAddFeatureButtonCss = categoryPanelCss + ".add-form form button[type=submit]";

        var removeAllFeatures = function(done){
            etcd.rmdir('v1', { recursive: true }, function(){
                done();
            });
        };

        beforeEach(function(done) {
            removeAllFeatures(function() {
                etcd.mkdir("v1/toggles/TestApp", function () {
                    etcd.set('v1/toggles/TestApp/DifferentCategoryTestFeature/@meta', JSON.stringify({ categoryId: 2 }), function(){
                        browser.get('/#!/applications/TestApp');
                        done();
                    });
                });
            });
        });

        afterEach(function(done){
            removeAllFeatures(done);
        });

        var clickAddFeatureButton = function(){
            var addFeatureButton = element(by.css(addFeatureButtonCss));
            addFeatureButton.click();
            browser.waitForAngular();
        };

        var enterNewFeatureName = function(newFeatureName){
            var featureNameInput = element(by.css(addFeatureNameInputCss));
            featureNameInput.sendKeys(newFeatureName);
            browser.waitForAngular();
        };

        var clickSubmitNewFeatureButton = function(){
            var submitNewFeatureButton = element(by.css(submitAddFeatureButtonCss));
            submitNewFeatureButton.click();
            browser.waitForAngular();
        };

        var clickCancelNewFeatureButton = function(){
            var cancelNewFeatureButton = element(by.css(cancelAddFeatureButtonCss));
            cancelNewFeatureButton.click();
            browser.waitForAngular();
        };

        var assertAddFeatureFormIsDisplayed = function(isDisplayed){
            expect(element(by.css(addFeatureButtonCss)).isDisplayed()).toBe(!isDisplayed);
            expect(element(by.css(addFeatureNameInputCss)).isDisplayed()).toBe(isDisplayed);
            expect(element(by.css(cancelAddFeatureButtonCss)).isDisplayed()).toBe(isDisplayed);
            expect(element(by.css(submitAddFeatureButtonCss)).isDisplayed()).toBe(isDisplayed);
        };

        var addNewFeature = function(newFeatureName){
            clickAddFeatureButton();
            enterNewFeatureName(newFeatureName);
            clickSubmitNewFeatureButton();
        };

        var assertFeatureHasBeenAdded = function(featureName){
            var features = element.all(by.repeater('feature in category.features'));
            expect(features.count()).toBe(2);
            expect(features.get(0).element(by.binding('feature.name')).getText()).toBe(featureName);
        };

        it("should display the New Feature button", function(){
            expect(element(by.css(addFeatureButtonCss)).getText()).toBe("New Feature");
            assertAddFeatureFormIsDisplayed(false);
        });

        it("should show the add new feature form when New Feature is clicked", function(){
            clickAddFeatureButton();
            assertAddFeatureFormIsDisplayed(true);
        });

        it("should hide the add new feature form when cancelling adding a feature", function(){
            clickAddFeatureButton();
            clickCancelNewFeatureButton();
            assertAddFeatureFormIsDisplayed(false);
        });

        it("should hide the add new feature form when a feature has been added", function(){
            addNewFeature("TestFeature");
            assertAddFeatureFormIsDisplayed(false);
        });

        it("should display a newly added feature once it has been added", function(){
            addNewFeature("TestFeature");
            assertFeatureHasBeenAdded("TestFeature");
        });

        it("should display a newly added feature once it has been added and the browser has been refreshed", function(){
            addNewFeature("TestFeature");
            browser.get('/#!/applications/TestApp', function(){
                assertFeatureHasBeenAdded("TestFeature");
            });
        });

        it("should not allow a feature to be created with the same name as one already", function(){
            addNewFeature("TestFeature");
            addNewFeature("TestFeature");

            assertAddFeatureFormIsDisplayed(true);
            expect(element.all(by.repeater('feature in category.features')).count()).toBe(2);
            expect(element(by.binding("alert.message")).getText()).toBe("Feature name must be unique in this application");
        });

        it("should not allow a feature to be created with the same name as one already - case insensitive", function(){
            addNewFeature("TestFeature");
            addNewFeature("TESTFeature");

            assertAddFeatureFormIsDisplayed(true);
            expect(element.all(by.repeater('feature in category.features')).count()).toBe(2);
            expect(element(by.binding("alert.message")).getText()).toBe("Feature name must be unique in this application");
        });

        it("should not allow a feature to be created with the same name as one that already exists in another category", function(){
            addNewFeature("DifferentCategoryTestFeature");

            assertAddFeatureFormIsDisplayed(true);
            expect(element.all(by.repeater('feature in category.features')).count()).toBe(1);
            expect(element(by.binding("alert.message")).getText()).toBe("Feature name must be unique in this application");
        });

        _.each(["FeatureWithNumbers123", "1StartsWithNumber", "Dots.AndMoreDot.s", "Under_scores", "Dashes-here"], function(validFeatureName){
            it("should accept a valid feature name: " + validFeatureName, function() {
                addNewFeature(validFeatureName);
                assertFeatureHasBeenAdded(validFeatureName);
            });
        });

        if (!process.env.TRAVIS_BUILD_NUMBER){
            it("should not accept a spaces in a feature name", function(){
                addNewFeature("Space in this name");
                assertAddFeatureFormIsDisplayed(true);
                expect(element.all(by.repeater('feature in category.features')).count()).toBe(1);
                expect(element(by.binding("alert.message")).getText()).toBe("Feature name must be alphanumeric with no spaces");
            });
        }
            
        _.each(["Slash/es", "Back\\SlashesToo", "Weird@Chars"], function(invalidFeatureName){
            it("should not accept a invalid feature name: " + invalidFeatureName, function(){
                addNewFeature(invalidFeatureName);
                assertAddFeatureFormIsDisplayed(true);
                expect(element.all(by.repeater('feature in category.features')).count()).toBe(1);
                expect(element(by.binding("alert.message")).getText()).toBe("Feature name must be alphanumeric with no spaces");
            });
        });
    });
});


