'use strict';

module.exports = {
  getForApplication: function(req, res, next) {
    res.send('application');
    next();
  }
};
