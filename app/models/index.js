const mongoose = require('mongoose')
const User = require('./user')
const MagicBox = require('./magicbox')
const Folder = require('./folder')
const { Role, ROLES } = require('./role')

mongoose.Promise = global.Promise

module.exports = {
   mongoose,
   User,
   MagicBox,
   Folder,
   Role,
   ROLES
}
