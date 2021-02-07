const mongoose = require('mongoose')
const { toJSON } = require('./helper')

const Role = mongoose.model(
    'Role',
    new mongoose.Schema({
        name: {
            type: String,
            unique: true,
            required: true
        }
    }, { toJSON })
)

module.exports = {
    Role,
    ROLES: {
        user: 'user',
        admin: 'admin'
    }
}
