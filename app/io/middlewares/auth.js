const jwt = require('jsonwebtoken')
const keys = require('../../keys')
const db = require('../../models')

const ROLES = db.ROLES

const verifyToken = (socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
        return next()
    }

    jwt.verify(token, keys.jwtSecret, (err, decoded) => {
        if (err) {
            return next()
        }
        socket.user = {
            id: decoded.id,
            isAdmin: decoded.role == ROLES.admin,
            name: decoded.name
        }
        next()
    })
}

module.exports = {
    verifyToken
}
