'use strict';

var categoriesService = require(__base + '/domain/category');

module.exports = {
  allForApplication: function (req, res, next) {
    res.send('all for an application');
    next();
  },

  byName: function (req, res, next) {
    res.send('by name');
    // TODO: a JSON object also containing the audit trail
    next();
  },

  updateMetaData: function (req, res, next) {
    res.send('updated!');
    next();
  },

  toggle: function (req, res, next) {
    res.send('toggle');
    next();
  },

  categories: function (req, res, next) {
    var categories = categoriesService.getCategoriesFromConfig();
    var model = {
      categories: categories
    };
    res.send(model);
    next();
  }
};
