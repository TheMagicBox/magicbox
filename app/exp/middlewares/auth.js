const controller = require('../../controllers/auth')
const formatter = require('../../utils/formatter')
const db = require('../../models')

const ROLES = db.ROLES

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token']
    controller.verifyToken(token)
    .then(user => {
        req.user = {
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
