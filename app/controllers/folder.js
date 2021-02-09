const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const db = require('../models')
const { sign, verify } = require('../services/keys')
const { STORAGE } = require('../app')

const Folder = db.Folder
const MagicBox = db.MagicBox

const getFolders = (req, res) => {
    Folder.find({ owner: req.user.id })
    .populate({
        path: 'owner',
        populate: [{ path: 'role' }]
    })
    .populate('sharedWith')
    .exec((err, folders) => {
        if (err) {
            return res.status(500).end()
        }

        res.json(folders.map(folder => {
            const dir = folder.toJSON()
            delete dir.owner.password
            return dir
        }))
    })
}

const getFolderContent = (req, res) => {
    const folderId = req.params.folderId

    if (!folderId) {
        return res.status(400).send('Missing parameters: folderId.')
    }

    const directory = path.join(STORAGE, req.folder.path)
    const content = fs.readdirSync(directory)
    res.json(content)
}

const createFolder = (req, res) => {
    const name = req.body.name

    if (!name) {
        return res.status(400).send('Missing parameters: name.')
    }

    const subDirectory = path.join(req.user.name, name)
    const directory = path.join(STORAGE, subDirectory)
    if (fs.existsSync(directory)) {
        return res.status(400).send('Folder already exists.')
    }
    fs.mkdirSync(directory, { recursive: true })

    new Folder({
        path: subDirectory,
        owner: req.user.id
    }).save((err, folder) => {
        if (err) {
            return res.status(500).end()
        }
        res.json(folder.toJSON())
    })
}

const createFolderForSharing = (req, res) => {
    const name = req.body.name
    const origin = req.body.origin
    const signature = req.body.signature

    if (!name || !origin || !signature) {
        return res.status(400).send('Missing parameters: name, origin, signature.')
    }

    MagicBox.findOne({ url: origin.url, account: origin.account })
    .populate('addedBy')
    .exec((err, magicbox) => {
        if (err) {
            return res.status(500).end()
        }

        if (!magicbox) {
            return res.status(404).send('You are not in this MagicBox contacts.')
        }

        const signatureBuffer = Buffer.from(signature, 'base64')
        if (!verify(data, signatureBuffer, magicbox.publicKey)) {
            return res.status(401).send('Your signature doesn\'t match the MagicBox owner\'s.')
        }

        const subDirectory = path.join(magicbox.addedBy.username, name)
        const directory = path.join(STORAGE, subDirectory)
        if (fs.existsSync(directory)) {
            return res.status(400).send('Folder already exists.')
        }
        fs.mkdirSync(directory, { recursive: true })

        new Folder({
            path: subDirectory,
            owner: magicbox.addedBy._id,
            sharedWith: [{
                magicbox: magicbox._id,
                folderId: origin.folderId
            }]
        }).save((err, folder) => {
            if (err) {
                return res.status(500).end()
            }
            res.json({ folderId: folder._id })
        })
    })
}

const shareFolder = (req, res) => {
    const folderId = req.params.folderId
    const magicboxIds = req.body.magicboxIds

    if (!magicboxIds) {
        return res.status(400).send('Missing parameters: magicboxIds.')
    }

    Folder.findById(folderId, (err, folder) => {
        if (err) {
            return res.status(500).end()
        }

        if (!folder) {
            return res.status(404).send('Folder not found.')
        }

        MagicBox.find({ addedBy: req.user.id, _id: { $in: magicboxIds } }, (err, magicboxes) => {
            if (err) {
                return res.status(500).end()
            }

            const promises = magicboxes.map(magicbox => {
                const origin = {
                    url: req.magicbox.url,
                    account: req.user.id,
                    folderId: folder._id
                }

                return sign(origin).then(signature => {
                    const options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: path.basename(folder.path),
                            origin: origin,
                            signature: signature.toString('base64')
                        })
                    }

                    return fetch(`${magicbox.url}/api/folders/share`, options)
                    .then(response => {
                        if (response.ok) {
                            return response
                        }
                        throw response
                    })
                    .then(response => response.json())
                    .then(response => {
                        return {
                            magicbox: magicbox._id,
                            folderId: response.folderId
                        }
                    })
                })
            })

            Promise.all(promises).then(sharedWith => {
                folder.sharedWith.push(...sharedWith)
                folder.save().then(newFolder => {
                    res.json(newFolder.toJSON())
                }).catch(err => {
                    res.status(500).end()
                })
            }).catch(response => {
                response.text().then(message => {
                    res.status(response.status).send(message)
                })
            })
        })
    })
}

module.exports = {
    getFolders,
    getFolderContent,
    createFolder,
    createFolderForSharing,
    shareFolder
}
