const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config/auth')
const db = require('../../models')

const User = db.User
const Role = db.Role
const ROLES = db.ROLES

const signUp = (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (!username || !password) {
        return res.status(400).send('Missing parameters: username, password')
    }

    User.estimatedDocumentCount((err, count) => {
        const roleName = (err || count > 0) ? ROLES.user : ROLES.admin
        Role.findOne({ name: roleName }, (err, role) => {
            if (err) {
                return res.status(500).end()
            }

            User.findOne({ username }).exec((err, user) => {
                if (err) {
                    return res.status(500).end()
                }

                if (user) {
                    return res.status(400).send('Username already exists!')
                }

                new User({
                    username: username,
                    password: bcrypt.hashSync(password, 8),
                    role: role._id
                })
                .save((err, user) => {
                    if (err) {
                        return res.status(500).end()
                    }

                    const data = user.toJSON()
                    delete data.password
                    data.role = role.toJSON()
                    res.json(data)
                })
            })
        })
    })
}

const signIn = (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (!username || !password) {
        return res.status(400).send('Missing parameters: username, password')
    }

    User.findOne({ username }).populate('role').exec((err, user) => {
        if (err) {
            return res.status(500).end()
        }

        if (!user) {
            return res.status(400).send('User not found.')
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).send('Invalid password!')
        }

        const obj = {
            id: user.id,
            role: user.role.name
        }

        const token = jwt.sign(obj, config.secret, {
            expiresIn: 60 * 60 * 24 * 30
        })

        const data = user.toJSON()
        delete data.password
        data.accessToken = token
        res.json(data)
    })
}

module.exports = {
    signUp,
    signIn
}
