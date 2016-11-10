'use strict';

var _ = require('underscore'),
	category = require('./../category');

var redis = require('redis'),
	redisClient = redis.createClient();

module.exports = {
	getFeatureCategories: function(applicationName, cb) {
		var categories = category.getCategoriesFromConfig();
		category.totalFeatureToggles = 0;

		redisClient.keys('toggle:' + applicationName + ':*', function(err, toggleKeys) {
			if (err) {
				cb(err);
			}

			if (toggleKeys.length === 0) {
				cb(null, {
	                categories: categories
	            });	
			}

			_.each(toggleKeys, function(toggleKey) {

				redisClient.hgetall(toggleKey, function(err, toggleHash) {
					if (err) {
						cb(err);
					}

					category.totalFeatureToggles += 1;

					categories[toggleHash.categoryId].features.push(
						buildFeatureToggle(toggleKey, toggleHash)
					);

					if (toggleKeys.length === category.totalFeatureToggles) {
						cb(null, {
			                categories: categories
			            });
					}
				});
			});
		});
	},

	addFeature: function (applicationName, featureName, featureDescription, categoryId, req, cb) {
		redisClient.hmset('toggle:' + applicationName + ':' + featureName, {
			'value': 'false',
			'description': featureDescription,
			'categoryId': categoryId
		});

		cb();
	},

	getFeature: function (applicationName, featureName, cb) {
		redisClient.hgetall('toggle:' + applicationName + ':' + featureName, function(err, toggleHash) {

	        cb(null, {
	            applicationName: applicationName,
	            featureName: featureName,
	            featureDescription: toggleHash.description,
	            toggles: [ {
	            	name: featureName,
	            	value: toggleHash.value == 'true'
	            }],
	            isMultiToggle: false, // needs amending
	            toggleSuggestions: '' // needs amending
	        });
		});
	},

	updateFeatureToggle: function (applicationName, featureName, value, req, cb) {
		redisClient.hset('toggle:' + applicationName + ':' + featureName, 'value', value, function(err) {
	        if (err) {
	            return cb(err);
	        }

	        cb();
		});
	},

	deleteFeature: function (applicationName, featureName, req, cb) {
		redisClient.del('toggle:' + applicationName + ':' + featureName, function(err) {
			if (err) {
				cb(err);
			}

			cb();
		});
	}
};

var getToggleName = function(toggleKey) {
	var splitKey = toggleKey.split(':');
    return splitKey[splitKey.length - 1];
};

var buildFeatureToggle = function(toggleKey, toggleHash) {
	var toggle = {
		values: []
	};

	toggle.name = getToggleName(toggleKey);
	toggle.categoryId = toggleHash.categoryId;
	toggle.description = toggleHash.description;
	toggle.values.push(toggleHash.value == 'true');

	return toggle;
};