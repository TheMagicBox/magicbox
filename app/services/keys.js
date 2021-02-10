const crypto = require('crypto')
const db = require('../models')
const keys = require('../keys')

const sign = data => {
    const sign = crypto.createSign('sha256')
    sign.write(Buffer.from(JSON.stringify(data)))
    sign.end()
    return sign.sign({
        key: keys.privateKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING
    })
}

const verify = (data, signature, publicKey) => {
    const verify = crypto.createVerify('sha256')
    verify.write(Buffer.from(JSON.stringify(data)))
    verify.end()
    return verify.verify({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING
    }, signature)
}

const genSignToken = payload => {
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64')
    const signature = sign(payload).toString('base64')
    return `${encoded}.${signature}`
}

module.exports = {
    sign,
    verify,
    genSignToken
}
