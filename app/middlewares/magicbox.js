const db = require('../models')

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

module.exports = {
    magicBoxNotRegistered,
    isMagicBoxRegistered
}
