const ngrok = require('ngrok')
const db = require('../models')

const MagicBox = db.MagicBox

const getMagicBox = () => {
    return new Promise((resolve, reject) => {
        MagicBox.findOne({ default: true }, (err, magicbox) => {
            if (err) {
                return reject(err)
            }

            if (!magicbox) {
                return reject('MagicBox not registered yet.')
            }

            resolve(magicbox.toJSON())
        })
    })
})

const registerMagicBox = async name => {
    return new Promise((resolve, reject) => {
        new MagicBox({
            name,
            default: true
        }).save((err, magicbox) => {
            if (err) {
                return reject(err)
            }
            resolve(magicbox.toJSON())
        })
    })
}

const exposeMagicBox = () => {
    return ngrok.connect(process.env.SERVER_PORT)
}

module.exports = {
    getMagicBox,
    registerMagicBox,
    exposeMagicBox
}
