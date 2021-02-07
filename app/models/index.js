const mongoose = require('mongoose')
const User = require('./user')
const { Role, ROLES } = require('./role')

mongoose.Promise = global.Promise

module.exports = {
   mongoose,
   User,
   Role,
   ROLES
}
