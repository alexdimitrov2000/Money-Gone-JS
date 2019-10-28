const config = require('../config/config');
const models = require('../models');
const jwt = require('../utilities/jwt')

module.exports = {
    get: {
        login: (req, res) => {
            if (req.cookies["username"]) {
                res.redirect('/');
                return;
            }
            res.render('login')
        },
        register: (req, res) => {
            if (req.cookies["username"]) {
                res.redirect('/');
                return;
            }
            res.render('register')
        },
        logout: (req, res) => {
            res.clearCookie(config.authCookie).clearCookie('username').redirect('/');
        },
        profile: (req, res, next) => {
            const userId = req.user._id;

            models.User.findById(userId).populate('expenses').then(user => {
                user.expensesCount = user.expenses.length;
                user.expensesAmount = Object.values(user.expenses).reduce((t, value) => t + value.amount, 0);
    
                res.render('profile', { user });
            })

        }
    },
    post: {
        login: (req, res, next) => {
            const { username, password } = req.body;
            models.User.findOne({ username }).then((user) => Promise.all([user, user.checkPassword(password)])
                .then(([user, match]) => {
                    if (!match) {
                        res.render('login', { errors: ['Invalid credentials!'] });
                        return;
                    }

                    const token = jwt.createToken({ id: user._id });

                    res.cookie(config.authCookie, token).cookie('username', user.username).redirect('/');
                })).catch((err) => {
                    res.render('login', { errors: ['Invalid credentials!'] });
                });
        },
        register: (req, res, next) => {
            let { username, password, repeatPassword, amount } = req.body;

            if (password !== repeatPassword) {
                res.render('register', { username, errors: ['Passwords should match!'] });
                return;
            }

            amount = Number(amount);
            models.User.create({ username, password, amount }).then((user) => {
                res.redirect('/user/login');
            }).catch(err => {
                let errors = [];

                if (err.name === 'ValidationError') {
                    errors = Object.entries(err.errors).map(e => e[1].message);
                } else if (err.name === 'MongoError') {
                    errors = [ 'Username is already taken!'];
                }

                res.render('register', { errors });
            });
        },
        refill: (req, res, next) => {
            let { amount } = req.body;
            let inputAmount = Number(amount);

            const userId = req.user._id;

            models.User.findById(userId).then(user => {
                user.amount = user.amount + inputAmount;

                return models.User.findByIdAndUpdate(userId, user);
            }).then((user) => {
                res.redirect('/');
            }).catch(err => {
                console.log(err);
            });
        }
    }
}