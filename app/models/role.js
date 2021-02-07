const mongoose = require('mongoose')
const { toJSON } = require('./helper')

const Role = mongoose.model(
    'Role',
    new mongoose.Schema({
        name: String
    }, { toJSON })
)

module.exports = {
    Role,
    ROLES: {
        user: 'user',
        admin: 'admin'
    }
}
