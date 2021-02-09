const ngrok = require('ngrok')
const fetch = require('node-fetch')
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
    MagicBox.find({ addedBy: req.user.id }, (err, magicboxes) => {
        if (err) {
            return res.status(500).end()
        }

        res.json(magicboxes.map(magicbox => magicbox.toJSON()))
    })
}

const addMagicBox = (req, res) => {
    const name = req.body.name
    const url = req.body.url
    const account = req.body.account

    if (!name || !url) {
        return res.status(400).send('Missing parameters: name, url, account.')
    }

    fetch(`${url}/api/users/${account}`)
    .then(response => {
        if (response.ok) {
            return response
        }
        throw response
    })
    .then(response => response.json())
    .then(response => {
        new MagicBox({
            name,
            url,
            account: response.userId,
            addedBy: req.user.id,
            publicKey: response.publicKey
        }).save((err, magicbox) => {
            if (err) {
                return res.status(500).end()
            }

            res.json(magicbox.toJSON())
        })
    })
    .catch(response => {
        response.text().then(message => {
            res.status(response.status).send(message)
        })
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
        return res.status(500).send(err)
    })
}

module.exports = {
    getMagicBox,
    getMagicBoxContacts,
    addMagicBox,
    registerMagicBox
}
