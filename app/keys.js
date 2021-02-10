const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const keysDirectory = './keys'
const publicKeyFilepath = path.join(keysDirectory, 'public.pem')
const privateKeyFilepath = path.join(keysDirectory, 'private.pem')
const jwtSecretFilepath = path.join(keysDirectory, 'jwt.secret')

let publicKey = null
let privateKey = null
let jwtSecret = null

if ([publicKeyFilepath, privateKeyFilepath, jwtSecretFilepath].every(f => fs.existsSync(f))) {
    publicKey = fs.readFileSync(publicKeyFilepath, 'utf-8')
    privateKey = fs.readFileSync(privateKeyFilepath, 'utf-8')
    jwtSecret = fs.readFileSync(jwtSecretFilepath, 'utf-8')
} else {
    const keys = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem'
        }
    })

    const secret = crypto.randomBytes(32).toString('hex')

    if (!fs.existsSync(keysDirectory)) {
        fs.mkdirSync(keysDirectory)
    }

    fs.writeFileSync(publicKeyFilepath, keys.publicKey)
    fs.writeFileSync(privateKeyFilepath, keys.privateKey)
    fs.writeFileSync(jwtSecretFilepath, secret)

    publicKey = keys.publicKey
    privateKey = keys.privateKey
    jwtSecret = secret

    console.log('RSA keys & JWT secret generated.')
}

module.exports = {
    publicKey,
    privateKey,
    jwtSecret
}
