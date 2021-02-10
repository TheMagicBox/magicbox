const db = require('../models')
const keys = require('../keys')

const User = db.User

const getUser = (req, res) => {
    User.findById(req.user.id)
    .populate('role')
    .exec((err, user) => {
        if (err) {
            return res.status(500).end()
        }

        const data = user.toJSON()
        delete data.password
        res.json(data)
    })
}

const getUserInformationFromName = (req, res) => {
    const username = req.params.username

    if (!username) {
        return res.status(400).send('Missing parameters: username.')
    }

    User.findOne({ username }, (err, user) => {
        if (err) {
            return res.status(500).end()
        }

        if (!user) {
            return res.status(404).send('User not found.')
        }

        res.json({
            username,
            userId: user._id,
            publicKey: keys.publicKey
        })
    })
}

module.exports = {
    getUser,
    getUserInformationFromName
}
