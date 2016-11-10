'use strict';

var redis = require('redis'),
	redisClient = redis.createClient();

var _ = require('underscore');

module.exports = {
	getApplications: function (cb) {
		redisClient.lrange('applications', 0, -1, function(err, applications) {
	
			if (err) {
            	return cb(err);
			}

			cb(null, applications);
		});
	},

	addApplication: function (applicationName, req, cb) {
        redisClient.lpush('applications', applicationName, function(err) {
			if (err) {
            	return cb(err);
			}

			cb();
        });
    },

    getApplicationMetaData: function () {
    	//todo
    },

    deleteApplicationMetaData: function (applicationName, cb) {
    	//todo

    	cb();
    },

    deleteApplication: function (applicationName, req, cb) {
    	redisClient.lrem('applications', 0, applicationName, function(err) {
    		if (err) {
            	return cb(err);
			}

			redisClient.keys('toggle:' + applicationName + ':*', function(err, keys) {
				if (keys.length > 0) {
					_.each(keys, function(key) {

						redisClient.del(key, function(err) {
							if (err) {
	            				return cb(err);
							}
						});
					});
				}
			});
    	});

    	cb();
    }
};