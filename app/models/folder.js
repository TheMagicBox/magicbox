const mongoose = require('mongoose')
const { toJSON } = require('./helper')

const Folder = mongoose.model(
    'Folder',
    new mongoose.Schema({
        path: {
            type: String,
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        sharedWith: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MagicBox'
        }]
    }, { toJSON })
)

module.exports = Folder
