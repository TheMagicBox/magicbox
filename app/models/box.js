const mongoose = require('mongoose')
const { toJSON } = require('./helper')

const Box = mongoose.model(
    'Box',
    new mongoose.Schema({
        name: String,
        url: String
    }, { toJSON })
)

module.exports = Box
