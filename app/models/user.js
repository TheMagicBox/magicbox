const mongoose = require('mongoose')
const { toJSON } = require('./helper')

const User = mongoose.model(
    'User',
    new mongoose.Schema({
        username: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            unique: true,
            required: true
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }
    }, { toJSON })
)

module.exports = User
