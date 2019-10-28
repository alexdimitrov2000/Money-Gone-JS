const router = require('express').Router();
const controllers = require('../controllers');
const auth = require('../utilities/auth');

router.get('/login', controllers.user.get.login);
router.post('/login', controllers.user.post.login);

router.get('/register', controllers.user.get.register);
router.post('/register', controllers.user.post.register);

router.get('/logout', auth(), controllers.user.get.logout);

router.post('/refill', auth(), controllers.user.post.refill);

router.get('/profile', auth(), controllers.user.get.profile);

module.exports = router;