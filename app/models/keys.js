const mongoose = require('mongoose')
const { toJSON } = require('./helper')

const Keys = mongoose.model(
    'Keys',
    new mongoose.Schema({
        publicKey: String,
        privateKey: String
    }, { toJSON })
)

module.exports = Keys
