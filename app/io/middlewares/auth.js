const controller = require('../../controllers/auth')
const db = require('../../models')

const ROLES = db.ROLES

const verifyToken = (socket, next) => {
    const token = socket.handshake.auth.token
    controller.verifyToken(token)
    .then(user => {
        socket.user = {
            id: user.id,
            isAdmin: user.role.name == ROLES.admin
        }
        next()
    })
    .catch(next)
}

module.exports = {
    verifyToken
}
