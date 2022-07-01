const router = require('express').Router();
const auth = require('../middlewares/auth');

router.use(require('./signin'));
router.use(require('./signup'));

router.use(auth, require('./users'));
router.use(auth, require('./movies'));

module.exports = router;
