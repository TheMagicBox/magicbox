const crypto = require('crypto')
const db = require('../models')
const keys = require('../keys')

const sign = async data => {
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

module.exports = {
    sign,
    verify
}
