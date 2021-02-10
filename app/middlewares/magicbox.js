const db = require('../models')
const { verify } = require('../services/keys')

const MagicBox = db.MagicBox

const magicBoxNotRegistered = (req, res, next) => {
    MagicBox.findOne({ default: true }, (err, magicbox) => {
        if (err) {
            return res.status(500).end()
        }

        if (magicbox) {
            return res.status(400).send('MagicBox already registered.')
        }

        next()
    })
}

const isMagicBoxRegistered = (req, res, next) => {
    MagicBox.findOne({ default: true }, (err, magicbox) => {
        if (err) {
            return res.status(500).end()
        }

        if (!magicbox) {
            return res.status(400).send('MagicBox not registered.')
        }

        if (!req.user) {
            req.user = {}
        }
        req.user.magicbox = magicbox.toJSON()
        next()
    })
}

const isMagicBoxContact = (req, res, next) => {
    const token = req.headers['x-signature-token']
    if (!token) {
        return res.status(401).send('No MagicBox signature token provided!')
    }

    const [payload64, signature64] = token.split('.')
    const payload = JSON.parse(Buffer.from(payload64, 'base64').toString())
    const signature = Buffer.from(signature64, 'base64')

    MagicBox.findOne({ url: payload.url, account: payload.account })
    .populate('addedBy')
    .exec((err, magicbox) => {
        if (err) {
            return res.status(500).end()
        }

        if (!magicbox) {
            return res.status(400).send('MagicBox not in contacts.')
        }

        if (!verify(payload, signature, magicbox.publicKey)) {
            return res.status(401).send('MagicBox signature doesn\'t match.')
        }

        req.magicbox = magicbox.toJSON()
        req.payload = payload
        next()
    })
}

module.exports = {
    magicBoxNotRegistered,
    isMagicBoxRegistered,
    isMagicBoxContact
}
