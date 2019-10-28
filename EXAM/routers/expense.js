const router = require('express').Router();
const controllers = require('../controllers');
const auth = require('../utilities/auth');

router.get('/add', auth(), controllers.expense.get.add);
router.post('/add', auth(), controllers.expense.post.add);

router.get('/report/:id', auth(), controllers.expense.get.report);

router.get('/delete/:id', auth(), controllers.expense.delete);

module.exports = router;