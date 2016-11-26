'use strict';

var categoriesService = require(__base + '/domain/category');

module.exports = {
  allForApplication: function (req, res) {
    res.send('all for an application');
    next();
  },

  byName: function (req, res) {
    res.send('by name');
    // TODO: a JSON object also containing the audit trail
    next();
  },

  updateMetaData: function (req, res) {
    res.send('updated!');
    next();
  },

  toggle: function (req, res) {
    res.send('toggle');
    next();
  },

  categories: function (req, res) {
    var categories = categoriesService.getCategoriesFromConfig();
    var model = {
      categories: categories
    };
    res.send(model);
  }
};
