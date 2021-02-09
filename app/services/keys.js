const db = require('../models')

const KEYS = {}

const getKeys = () => {
    return new Promise((resolve, reject) => {
        if (!KEYS.publicKey || !KEYS.privateKey) {
            db.Keys.findOne({}, (err, keys) => {
                if (err) {
                    return reject()
                }

                if (!keys) {
                    return reject('No keys found.')
                }

                KEYS.publicKey = keys.publicKey
                KEYS.privateKey = keys.privateKey
                resolve({
                    publicKey: keys.publicKey,
                    privateKey: keys.privateKey,
                })
            })
        } else {
            resolve({
                publicKey: KEYS.publicKey,
                privateKey: KEYS.privateKey,
            })
        }
    })
}

const sign = async data => {
    return getKeys().then(keys => {
        const sign = crypto.createSign('sha256')
        sign.write(Buffer.from(JSON.stringify(data)))
        sign.end()
        return sign.sign({
            key: keys.privateKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING
        })
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
    getKeys,
    sign,
    verify
}
