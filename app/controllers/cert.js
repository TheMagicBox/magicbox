const keys = require('../keys')

const getPublicKey = (req, res) => {
    res.json({ publicKey: keys.publicKey })
}

module.exports = {
    getPublicKey
}
