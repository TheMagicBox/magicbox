const crypto = require('crypto')
const db = require('./models')

const Keys = db.Keys
const Role = db.Role
const ROLES = db.ROLES

exports.initializeDatabase = () => {
    Keys.estimatedDocumentCount((err, count) => {
        if (err || count > 0) {
            return
        }

        crypto.generateKeyPair('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
              type: 'pkcs1',
              format: 'pem'
            },
            privateKeyEncoding: {
              type: 'pkcs1',
              format: 'pem'
            }
        }, (err, publicKey, privateKey) => {
            new Keys({ publicKey, privateKey }).save((err, keys) => {
                console.log(`RSA key pair generated.`);
            })
        })
    })

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
