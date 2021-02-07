const jwt = require('jsonwebtoken')
const config = require('../../config/auth')
const db = require('../../models')

const ROLES = db.ROLES

const verifyToken = (socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
        return next()
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return next()
        }
        socket.user = {
            id: decoded.id,
            isAdmin: decoded.role == ROLES.admin
        }
        next()
    })
}

module.exports = {
    verifyToken
}
