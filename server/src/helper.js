exports.toggleslider = (toggleState) => {
  if (toggleState === true) {
    return 'checked="checked"';
  }

  return '';
};
