const localtunnel = require('localtunnel')
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

    if (!name || !url || !account) {
        return res.status(400).send('Missing parameters: name, url, account.')
    }

    const okJsonOrThrow = response => {
        if (response.ok) {
            return response.json()
        }
        throw response
    }

    Promise.all([
        fetch(`${url}/api/cert`).then(okJsonOrThrow),
        fetch(`${url}/api/users/${account}`).then(okJsonOrThrow)
    ]).then(responses => {
        const { publicKey } = responses[0]
        const { userId } = responses[1]

        new MagicBox({
            name,
            url,
            publicKey,
            account: userId,
            addedBy: req.user.id
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

    try {
        localtunnel({
            port: process.env.SERVER_PORT,
            host: process.env.MAGICBOX_SERVER,
            subdomain: name,
        }).then(tunnel => {
            new MagicBox({
                name,
                url: tunnel.url,
                tunnelToken: tunnel.token,
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
    } catch (err) {
        return res.status(500).send('Could not create tunnel. Try another name.')
    }
}

module.exports = {
    getMagicBox,
    getMagicBoxContacts,
    addMagicBox,
    registerMagicBox
}
