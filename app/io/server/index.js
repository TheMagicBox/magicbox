const controller = require('../../controllers/auth')
const formatter = require('../../utils/formatter')
const db = require('../../models')

const ROLES = db.ROLES

module.exports = socket => {
    socket.on('signup', (username, password) => {
        controller.signup(username, password)
        .then(user => {
            socket.emit('signup', formatter.success(user))
        })
        .catch(err => {
            socket.emit('signup', formatter.error(err))
        })
    })

    socket.on('signin', (username, password) => {
        controller.signin(username, password)
        .then(user => {
            socket.user = {
                id: user.id,
                isAdmin: user.role.name == ROLES.admin
            }
            socket.emit('signin', formatter.success(user))
        })
        .catch(err => {
            socket.emit('signin', formatter.error(err))
        })
    })
}
