const mongoose = require('mongoose')
const Keys = require('./keys')
const User = require('./user')
const MagicBox = require('./magicbox')
const Folder = require('./folder')
const { Role, ROLES } = require('./role')

mongoose.Promise = global.Promise

module.exports = {
   mongoose,
   Keys,
   User,
   MagicBox,
   Folder,
   Role,
   ROLES
}
