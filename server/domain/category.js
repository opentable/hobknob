const _ = require('underscore');
const config = require('config');
const acl = require('./acl');
const audit = require('./audit');

const getCategory = (id, name, description, columns, features) => ({
  id,
  name,
  description: description || '',
  columns: columns || [],
  features: features || []
});

const simpleCategoryId = 0;
module.exports.simpleCategoryId = simpleCategoryId;

const getSimpleCategory = (name, description) => getCategory(0, name || 'Simple Features',
    description || 'Used for simple on/off feature toggles', ['']);

const isSimpleCategory = categoryId => categoryId === simpleCategoryId;

module.exports.getCategoriesFromConfig = () => {
  if (!config.categories) {
    return { simpleCategoryId: getSimpleCategory() };
  }

  const categories = _.map(config.categories, (c) => {
    if (isSimpleCategory(c.id)) {
      return [simpleCategoryId, getSimpleCategory(c.name, c.description)];
    }
    return [c.id, getCategory(c.id, c.name, c.description, _.clone(c.values))];
  });
  return _.object(categories);
};
