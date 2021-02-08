const mongoose = require('mongoose')
const { toJSON } = require('./helper')

const Folder = mongoose.model(
    'Folder',
    new mongoose.Schema({
        path: {
            type: String,
            unique: true,
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        sharedWith: [{
            magicbox: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'MagicBox'
            },
            folderId: mongoose.Schema.Types.ObjectId
        }]
    }, { toJSON })
)

module.exports = Folder
