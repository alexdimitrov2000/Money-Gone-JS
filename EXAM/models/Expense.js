const mongoose = require('mongoose');
const Model = mongoose.model;
const Schema = mongoose.Schema;
const { String, ObjectId, Number, Boolean } = Schema.Types;

const expenseSchema = new Schema({
    merchant: {
        type: String,
        required: [true, 'Merchant is required'],
        minlength: [4, 'Merchant must be at least 4 characters long.'],
    },
    date: {
        type: Schema.Types.Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: 'Total must be a positive number!'
        }
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [10, 'Description should be at least 10 symbols long.'],
        maxlength: [50, 'Description should be maximum 50 symbols long.']
    },
    isReport: {
        type: Boolean,
        required: [true, 'Report is required'],
        default: false
    },
    creator: {
        type: ObjectId,
        ref: 'User',
        required: [true, 'Creator is required']
    }
});

module.exports = new Model('Expense', expenseSchema);