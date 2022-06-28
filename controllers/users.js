require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { BadRequest } = require('../errors/BadRequestError');
const { Conflict } = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const addUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    })
      .then((user) => {
        res.status(201).send({
          name: user.name,
          email,
        });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          const fields = Object.keys(err.errors).join(', ');
          return next(new BadRequest(`${fields} is not correct`));
        }
        if (err.code === 11000) {
          return next(new Conflict('This email is already taken:('));
        }
        return next(err);
      }));
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(
    id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        return next(new BadRequest(`${fields} is not correct`));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }),
      });
      return user;
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

module.exports = {
  addUser,
  updateUser,
  login,
  getCurrentUser,
};
