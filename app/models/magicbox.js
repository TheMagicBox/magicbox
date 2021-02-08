const mongoose = require('mongoose')
const { toJSON } = require('./helper')

const MagicBox = mongoose.model(
    'MagicBox',
    new mongoose.Schema({
        name: String,
        url: {
            type: String,
            unique: true,
            required: true
        },
        default: Boolean,
        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }, { toJSON })
)

module.exports = MagicBox
