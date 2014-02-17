require("js-yaml");

exports.getFeatureToggles = function (){
    var featureToggles = [{
		"Id": 1,
		"Name": "Toggle Ryan",
		"State": "active"
	},
	{
		"Id": 2,
		"Name": "Toggle 2",
		"State": "active"
	},
	{
		"Id": 3,
		"Name": "Toggle 3",
		"State": "active"
	}]
	
	return featureToggles;
};
