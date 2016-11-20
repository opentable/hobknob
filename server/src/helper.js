'use strict';

exports.toggleslider = function (toggleState) {
  if (toggleState === true) {
    return 'checked="checked"';
  }

  return '';
};
