const mongoose = require('mongoose')
const { toJSON } = require('./helper')

const MagicBox = mongoose.model(
    'MagicBox',
    new mongoose.Schema({
        name: String,
        url: String,
        default: {
            type: Boolean,
            default: false
        }
    }, { toJSON })
)

module.exports = MagicBox
