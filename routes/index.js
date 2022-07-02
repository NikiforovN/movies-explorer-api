const router = require('express').Router();
const auth = require('../middlewares/auth');
const { NotFound } = require('../errors/NotFoundError');

router.use(require('./signin'));
router.use(require('./signup'));

router.use(auth, require('./users'));
router.use(auth, require('./movies'));

router.use(auth, (_, res, next) => next(new NotFound()));

module.exports = router;
