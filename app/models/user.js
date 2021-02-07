const mongoose = require('mongoose')
const { toJSON } = require('./helper')

const User = mongoose.model(
    'User',
    new mongoose.Schema({
        username: String,
        password: String,
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }
    }, { toJSON })
)

module.exports = User
