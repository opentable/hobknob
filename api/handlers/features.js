'use strict';

module.exports = {
  allForApplication: function (req, res, next) {
    res.send('all for an application');
    next();
  },

  byName: function (req, res, next) {
    res.send('by name');
    next();
  },

  toggle: function (req, res, next) {
    res.send('toggle');
    next();
  }
};
