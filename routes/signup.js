const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  addUser,
} = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), addUser);

module.exports = router;
