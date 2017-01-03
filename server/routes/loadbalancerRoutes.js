const fs = require('fs');
const config = require('../../config/config.json');

exports.lbstatus = function (req, res) {
  const filePath = config.loadBalancerFile;
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.send(500, err);
    } else {
      res.send(data);
    }
  });
};
