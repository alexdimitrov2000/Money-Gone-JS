const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Model = mongoose.model;
const Schema = mongoose.Schema;
const { String, ObjectId, Number, Boolean } = Schema.Types;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username is already taken'],
        minlength: [4, 'Username must be at least 4 characters long.'],
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9]+$/.test(v);
            },
            message: 'Username must contain only english letters and digits.'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long.'],
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        default: 0,
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: 'Amount must be a positive number!'
        }
    },
    expenses: {
        type: [{ type: ObjectId, ref: 'Expense' }]
    }
});

userSchema.methods = {
    checkPassword: function (password) {
        return bcrypt.compare(password, this.password);
    }
};

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) { next(err); return; }

            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) { next(err); return; }
                this.password = hash;
                next();
            });
        });
        return;
    }
    next();
});

module.exports = new Model('User', userSchema);