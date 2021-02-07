const config = require('../config/auth')
const jwt = require('jsonwebtoken')
const db = require('../models')

const User = db.User
const ROLES = db.ROLES

const verifyToken = (socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
        next()
    } else {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                next()
            } else {
                socket.user = { id: decoded.id }
                User.findById(decoded.id).populate('role').exec((err, user) => {
                    if (!err && user) {
                        socket.user.isAdmin = user.role.name == ROLES.admin
                    }
                    next()
                })
            }
        })
    }
}

module.exports = {
    verifyToken
}
