const models = require('../models');
const moment = require('moment');

module.exports = {
    get: {
        add: (req, res) => {
            res.render('addExpense');
        },
        report: (req, res) => {
            const id = req.params.id;

            models.Expense.findById(id).then(expense => {
                if (expense.creator.toString() !== req.user._id) {
                    res.redirect('/');
                    return;
                }
                
                expense.formattedDate = moment(expense.date).format('YYYY-DD-MM');
                res.render('reportExpense', { expense });
            })
        }
    },
    post: {
        add: (req, res, next) => {
            let { merchant, amount, category, description } = req.body;
            amount = amount !== "" ? Number(amount) : undefined;
            const isReport = req.body['isReport'] !== undefined;
            const userId = req.user._id;

            if (req.user.amount < amount) {
                res.render('addExpense', { errors: [ 'Not enough money in your account! '] });
                return;
            }

            models.Expense.create({ merchant, amount, category, description, isReport, creator: userId }).then((expense) => {
                req.user.expenses.push(expense._id);
                req.user.amount -= amount;

                return models.User.findByIdAndUpdate(userId, req.user);
            }).then((user) => {
                res.redirect('/');
            }).catch(err => {
                let errors = [];

                if (err.name === 'ValidationError') {
                    errors = Object.entries(err.errors).map(e => e[1].message);
                }

                res.render('addExpense', { errors });
            });
        }
    },
    delete: (req, res, next) => {
        const id = req.params.id;

        models.Expense.deleteOne({ _id: id }).then(() => {
            res.redirect('/');
        }).catch(next);
    }
}