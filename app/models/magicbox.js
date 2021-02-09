const mongoose = require('mongoose')
const { toJSON } = require('./helper')

const MagicBox = mongoose.model(
    'MagicBox',
    new mongoose.Schema({
        name: String,
        url: String,
        account: mongoose.Schema.Types.ObjectId,
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        publicKey: String,
        default: Boolean
    }, { toJSON })
)

module.exports = MagicBox
