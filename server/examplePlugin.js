'use strict';

module.exports = function (app) {
    app.get('/example-plugin', function (req, res) {
        res.send(200);
    });
};
