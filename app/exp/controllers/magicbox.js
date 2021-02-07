const ngrok = require('ngrok')
const db = require('../../models')

const MagicBox = db.MagicBox

const getMagicBox = (req, res) => {
    MagicBox.findOne({ default: true }, (err, magicbox) => {
        if (err) {
            return res.status(500).end()
        }

        if (!magicbox) {
            return res.status(404).send('MagicBox not registered yet.')
        }

        res.json(magicbox.toJSON())
    })
}

const registerMagicBox = (req, res) => {
    const name = req.body.name
    if (!name) {
        return res.status(400).send('Missing parameters: name')
    }

    new MagicBox({
        name,
        default: true
    }).save((err, magicbox) => {
        if (err) {
            return res.status(500).end()
        }

        res.json(magicbox.toJSON())
    })
}

const exposeMagicBox = (req, res) => {
    ngrok.connect(process.env.SERVER_PORT)
    .then(url => {
        res.json({ url })
    })
    .catch(err => {
        return res.status(500).end()
    })
}

module.exports = {
    getMagicBox,
    registerMagicBox,
    exposeMagicBox
}
