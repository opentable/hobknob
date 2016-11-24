'use strict';

module.exports = {
  list: function(req, res, next) {
    res.send('list');
    next();
  },

  byName: function(req, res, next) {
    res.send('by name');
    next();
  }
};
