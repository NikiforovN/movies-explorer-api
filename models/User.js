const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const isEmail = require('validator/lib/isEmail');
const { BadRequest } = require('../errors/BadRequestError');
const { Unauthorized } = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => isEmail(v),
        message: 'Invalid Email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }, { runValidators: true }).select('+password')
    .then((user) => {
      if (!email || !password) {
        return Promise.reject(new BadRequest('email or passwrod is not correct'));
      }

      if (!user) {
        return Promise.reject(new Unauthorized());
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized('email or passwrod is not correct'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
