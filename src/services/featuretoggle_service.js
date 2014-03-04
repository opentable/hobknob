require("js-yaml");
var request = require("request");
var config = require("config").Endpoints.featureToggleApi;
var environmentConfig = require("config").Environment;

exports.getAllFeatureToggles = function(callback) {
  if (environmentConfig.useMockData) {
    return getMockFeatureToggles();
  }
  var url = config.connectionString + '/features';
  request(url, function (err, response, body) {
    if(err) { console.log(err); callback(); return; }
    callback(JSON.parse(body));
  });
};

exports.getFeatureToggle = function(id, callback) {
  if (environmentConfig.useMockData) {
    return getMockFeatureToggles()[0];
  }
  
  var url = config.connectionString + '/features/' + id;
  request(url, function (err, response, body) {
    if(err) { console.log(err); callback(); return; }
    callback(JSON.parse(body));
  });
};

exports.updateFeatureToggle = function(id, payload, callback) {
  var url = config.connectionString + '/features/' + id;
  request({
    method: 'PATCH',
    uri: url,
    json: payload
    }, function (error, response, body) {
      if (error) {
        console.log("Error: %j", error);
      }
      callback(response);
  });
};

// Move this mock data to a mock data repo
var getMockFeatureToggles = function (){
    var featureToggles = [{
		"_id": 1,
		"Name": "Reviews Api Caching",
        "ConfigString": "ReviewsApiCaching",
        "Description": "This is a toggle to look at whether the Reviews API has caching enabled or not. This will effectively decide if we make fresh calls to the reviews api or return stale data",
        "Tags": [ "dazzling-beavers", "restaurant-api", "api" ],
        "DomainConfiguration": 
            [{
                "DomainName": {
                    "DomainName": ".co.uk",
                    "DomainPrefix": "co.uk",
                    "DomainId": 70
                },
                "FeatureEnabled": true,
                "LastToggleActivity": "2013-04-22 23:56:49.617Z",
                "LastToggleUser": "pstack@opentable.com",
                "AbRate": 50
            },
            {
                "DomainName": {
                    "DomainName": ".com",
                    "DomainPrefix": "com",
                    "DomainId": 1
                },
                "FeatureEnabled": false,
                "LastToggleActivity": "2013-04-22 23:56:49.617Z",
                "LastToggleUser": "pstack@opentable.com",
                "AbRate": 50
            },
            {
                "DomainName": {
                    "DomainName": ".de",
                    "DomainPrefix": "de",
                    "DomainId": 3
                },
                "FeatureEnabled": false,
                "LastToggleActivity": "2013-04-22 23:56:49.617Z",
                "LastToggleUser": "pstack@opentable.com",
                "AbRate": 50
            },
            {
                "DomainName": {
                    "DomainName": ".jp",
                    "DomainPrefix": "jp",
                    "DomainId": 4
                },
                "FeatureEnabled": false,
                "LastToggleActivity": "2013-04-22 23:56:49.617Z",
                "LastToggleUser": "pstack@opentable.com",
                "AbRate": 50
            },
            {
                "DomainName": {
                    "DomainName": ".com.mx",
                    "DomainPrefix": "com.mx",
                    "DomainId": 11
                },
                "FeatureEnabled": false,
                "LastToggleActivity": "2013-04-22 23:56:49.617Z",
                "LastToggleUser": "pstack@opentable.com",
                "AbRate": 50
            }
        ]
        
	},
    {
	    "_id": 2,
		"Name": "Restaurant Profile Page SmartSEO",
        "ConfigString": "RestProfileSmartSEO",
        "Description": "This will control whether the smartseo feature for the restaurant profile page is enabled. We would only disable this if the site is under heavy load",
        "Tags": [ "dazzling-beavers", "restaurant-api", "api" ],
        "DomainConfiguration": 
            [{
                "DomainName": {
                    "DomainName": ".co.uk",
                    "DomainPrefix": "co.uk",
                    "DomainId": 70
                },
                "FeatureEnabled": true,
                "LastToggleActivity": "2013-04-22 23:56:49.617Z",
                "LastToggleUser": "pstack@opentable.com",
                "AbRate": 50
            },
            {
                "DomainName": {
                    "DomainName": ".com",
                    "DomainPrefix": "com",
                    "DomainId": 1
                },
                "FeatureEnabled": false,
                "LastToggleActivity": "2013-04-22 23:56:49.617Z",
                "LastToggleUser": "pstack@opentable.com",
                "AbRate": 50
            },
            {
                "DomainName": {
                    "DomainName": ".de",
                    "DomainPrefix": "de",
                    "DomainId": 3
                },
                "FeatureEnabled": false,
                "LastToggleActivity": "2013-04-22 23:56:49.617Z",
                "LastToggleUser": "pstack@opentable.com",
                "AbRate": 50
            },
            {
                "DomainName": {
                    "DomainName": ".jp",
                    "DomainPrefix": "jp",
                    "DomainId": 4
                },
                "FeatureEnabled": false,
                "LastToggleActivity": "2013-04-22 23:56:49.617Z",
                "LastToggleUser": "pstack@opentable.com",
                "AbRate": 50
            },
            {
                "DomainName": {
                    "DomainName": ".com.mx",
                    "DomainPrefix": "com.mx",
                    "DomainId": 11
                },
                "FeatureEnabled": false,
                "LastToggleActivity": "2013-04-22 23:56:49.617Z",
                "LastToggleUser": "pstack@opentable.com",
                "AbRate": 50
            }]
        
    },
        {
	    "_id": 3,
		"Name": "Restaurant Profile Overview Tab Reviews",
        "ConfigString": "RestProfileOVReviews",
        "Description": "This will control the 3 reviews in the 'featured reviews' section on the restaurant profile overview tab",
        "Tags": [ "dazzling-beavers", "restaurant-api", "api" ],
        "DomainConfiguration": 
            [{
                "DomainName": {
                    "DomainName": ".co.uk",
                    "DomainPrefix": "co.uk",
                    "DomainId": 70
                },
                "FeatureEnabled": true,
                "LastToggleActivity": "2013-04-22 23:56:49.617Z",
                "LastToggleUser": "pstack@opentable.com",
                "AbRate": 50
            },
            {
                "DomainName": {
                    "DomainName": ".com",
                    "DomainPrefix": "com",
                    "DomainId": 1
                },
                "FeatureEnabled": false,
                "LastToggleActivity": "2013-04-22 23:56:49.617Z",
                "LastToggleUser": "pstack@opentable.com",
                "AbRate": 50
            },
            {
                "DomainName": {
                    "DomainName": ".de",
                    "DomainPrefix": "de",
                    "DomainId": 3
                },
                "FeatureEnabled": false,
                "LastToggleActivity": "2013-04-22 23:56:49.617Z",
                "LastToggleUser": "pstack@opentable.com",
                "AbRate": 50
            },
            {
                "DomainName": {
                    "DomainName": ".jp",
                    "DomainPrefix": "jp",
                    "DomainId": 4
                },
                "FeatureEnabled": false,
                "LastToggleActivity": "2013-04-22 23:56:49.617Z",
                "LastToggleUser": "pstack@opentable.com",
                "AbRate": 50
            },
            {
                "DomainName": {
                    "DomainName": ".com.mx",
                    "DomainPrefix": "com.mx",
                    "DomainId": 11
                },
                "FeatureEnabled": false,
                "LastToggleActivity": "2013-04-22 23:56:49.617Z",
                "LastToggleUser": "pstack@opentable.com",
                "AbRate": 50
            }]
        }
    ]
	
	return featureToggles;
};
