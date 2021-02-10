const crypto = require('crypto')
const db = require('./models')

const Role = db.Role
const ROLES = db.ROLES

exports.initializeDatabase = () => {
    Role.estimatedDocumentCount((err, count) => {
        if (err || count > 0) {
            return
        }

        Object.values(ROLES).forEach(name => {
            new Role({ name }).save((err, role) => {
                console.log(`Role ${role.name} created.`)
            })
        })
    })
}
