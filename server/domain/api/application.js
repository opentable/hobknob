'use strict';

var request = require('request');
var config  = require(__base + '/../config/config.json');

var buildApiUrl = function(endpoint) {
  var host = config.dataSources.api.host;
  var port = config.dataSources.api.port;
  var scheme = config.dataSources.api.ssl ? "https" : "http";
  var url = scheme + "://" + host + ":" + port;
  return url + endpoint;
};

module.exports = {
    getApplications: function (cb) {
      var url = buildApiUrl("/v1/applications");
      request(url, function (error, response, body) {
        if (error != null || response.statusCode != 200) {
          cb(error, null)
          return;
        }

        cb(null, body);
      });
    },

    addApplication: function (applicationName, req, cb) {
      // TODO: implement me
    },

    deleteApplication: function (applicationName, req, cb) {
      // TODO: implement me
    },

    getApplicationMetaData: function (applicationName, cb) {
      var url = buildApiUrl("/v1/applications/" + applicationName);
      request(url, function (error, response, body) {
        if (error != null || response.statusCode != 200) {
          cb(error, null)
          return;
        }

        cb(null, body);
      });
    },

    deleteApplicationMetaData: function (applicationName, cb) {
      var url = buildApiUrl("/");
      console.log(url);
      cb(nil)
    },

    saveApplicationMetaData: function (applicationName, metaDataKey, metaDataValue, cb) {
      var url = buildApiUrl("/");
      console.log(url);
      cb(nil)
    }
};
