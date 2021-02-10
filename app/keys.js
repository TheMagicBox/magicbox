const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const keysDirectory = './keys'
const publicKeyFilepath = path.join(keysDirectory, 'public.pem')
const privateKeyFilepath = path.join(keysDirectory, 'private.pem')

let publicKey = null
let privateKey = null

if (fs.existsSync(publicKeyFilepath) && fs.existsSync(privateKeyFilepath)) {
    publicKey = fs.readFileSync(publicKeyFilepath, 'utf-8')
    privateKey = fs.readFileSync(privateKeyFilepath, 'utf-8')
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

    if (!fs.existsSync(keysDirectory)) {
        fs.mkdirSync(keysDirectory)
    }

    fs.writeFileSync(publicKeyFilepath, keys.publicKey)
    fs.writeFileSync(privateKeyFilepath, keys.privateKey)

    publicKey = keys.publicKey
    privateKey = keys.privateKey

    console.log('RSA keys generated.')
}

module.exports = {
    publicKey,
    privateKey
}
