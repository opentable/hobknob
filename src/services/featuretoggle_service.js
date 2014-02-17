require("js-yaml");

exports.getFeatureToggles = function (){
    var featureToggles = [{
		"_id": 1,
		"Name": "Reviews Api Caching",
        "ConfigString": "ReviewsApiCaching",
        "Description": "This is a toggle to look at whether the Reviews API has caching enabled or not. This will effectively decide if we make fresh calls to the reviews api or return stale data",
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
