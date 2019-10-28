const models = require('../models');
const moment = require('moment');

module.exports = {
    get: {
        index: (req, res, next) => {
            if (req.user) {
                const userId = req.user._id;

                models.User.findById(userId).populate('expenses').then(user => {
                    let expenses = user.expenses;
                    expenses.forEach(e => e.formattedDate = moment(e.date).format('YYYY-DD-MM'));

                    res.render('index', { expenses });
                });
            } else {
                res.render('index');
            }
        }
    }
}