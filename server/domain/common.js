'use strict';

module.exports = {
  getUserDetails: function (req) {
      return config.RequiresAuth ? req.user._json : {name: 'Anonymous'};
  }
};
