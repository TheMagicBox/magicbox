const controller = require('../../controllers/auth')
const formatter = require('../../utils/formatter')
const db = require('../../models')

const ROLES = db.ROLES

module.exports = socket => {
    socket.on('register', (username, password) => {
        controller.register(username, password)
        .then(user => {
            socket.emit('register', formatter.success(user))
        })
        .catch(err => {
            socket.emit('register', formatter.error(err))
        })
    })

    socket.on('login', (username, password) => {
        controller.login(username, password)
        .then(user => {
            socket.user = {
                id: user.id,
                isAdmin: user.role.name == ROLES.admin
            }
            socket.emit('login', formatter.success(user))
        })
        .catch(err => {
            socket.emit('login', formatter.error(err))
        })
    })
}
