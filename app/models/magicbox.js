const mongoose = require('mongoose')
const { toJSON } = require('./helper')

const MagicBox = mongoose.model(
    'MagicBox',
    new mongoose.Schema({
        name: String,
        url: String
    }, { toJSON })
)

module.exports = MagicBox
