var fs = require('fs');

exports.lbstatus = function (req, res) {
    fs.readFile('/etc/lbstatus/hobknob', 'utf8', function (err, data) {
        if (err) {
            res.send(500, err);
        }
        else {
            res.send(data);
        }
    });
};
