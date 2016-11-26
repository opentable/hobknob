'use strict';

var fs = require('fs');
var config = require(__base + '/../config/api.json');

module.exports = {
  loadBalancer: function (req, res) {
      var filePath = config.loadBalancerFile;
      fs.readFile(filePath, 'utf8', function (err, data) {
          if (err) {
              res.send(500, err);
          }
          else {
              res.send(data);
          }
      });
  },

  serviceStatus: function (req, res) {
    // TODO: implement me properly
    res.status(200).end();
  }
};
