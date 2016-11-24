'use strict';

var fs = require('fs');
var config = require(__base + '/../config/config.json');

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
  }
};
