const ngrok = require('ngrok')
const db = require('../models')

const MagicBox = db.MagicBox

const getMagicBox = (req, res) => {
    MagicBox.findOne({ default: true }, (err, magicbox) => {
        if (err) {
            return res.status(500).end()
        }

        if (!magicbox) {
            return res.status(404).send('MagicBox not registered yet.')
        }

        const box = magicbox.toJSON()
        delete box.default
        res.json(box)
    })
}

const getMagicBoxContacts = (req, res) => {
    MagicBox.find({ account: req.user.id }, (err, magicboxes) => {
        if (err) {
            return res.status(500).end()
        }

        const boxes = magicboxes.map(magicbox => magicbox.toJSON())
        res.json(boxes)
    })
}

const addMagicBox = (req, res) => {
    const name = req.body.name
    const url = req.body.url

    if (!name || !url) {
        return res.status(400).send('Missing parameters: name, url.')
    }

    new MagicBox({
        name,
        url,
        account: req.user.id
    }).save((err, magicbox) => {
        if (err) {
            return res.status(500).end()
        }

        const box = magicbox.toJSON()
        res.json(box)
    })
}

const registerMagicBox = (req, res) => {
    const name = req.body.name

    if (!name) {
        return res.status(400).send('Missing parameters: name.')
    }

    ngrok.connect(process.env.SERVER_PORT)
    .then(url => {
        new MagicBox({
            name,
            url,
            default: true
        }).save((err, magicbox) => {
            if (err) {
                return res.status(500).end()
            }

            const box = magicbox.toJSON()
            delete box.default
            res.json(box)
        })
    })
    .catch(err => {
        return res.status(500).end()
    })
}

module.exports = {
    getMagicBox,
    getMagicBoxContacts,
    addMagicBox,
    registerMagicBox
}
