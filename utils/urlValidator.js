const validator = require('validator');

function urlValidator(value) {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
}

module.exports = {
  urlValidator,
};
