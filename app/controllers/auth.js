const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config/auth')
const db = require('../models')

const User = db.User
const Role = db.Role
const ROLES = db.ROLES

const register = (username, password) => {
    return new Promise((resolve, reject) => {
        Role.findOne({ name: ROLES.user }, (err, role) => {
            if (err) {
                return reject(err)
            }

            User.findOne({ username }).exec((err, user) => {
                if (err) {
                    return reject(err)
                }

                if (user) {
                    return reject('Username already exists!')
                }

                new User({
                    username: username,
                    password: bcrypt.hashSync(password, 8),
                    role: role._id
                })
                .save((err, user) => {
                    if (err) {
                        return reject(err)
                    }

                    const data = user.toJSON()
                    delete data.password
                    data.role = role.toJSON()
                    resolve(data)
                })
            })
        })
    })
}

const login = (username, password) => {
    return new Promise((resolve, reject) => {
        User.findOne({ username }).populate('role').exec((err, user) => {
            if (err) {
                return reject(err)
            }

            if (!user) {
                return reject('User not found.')
            }

            if (!bcrypt.compareSync(password, user.password)) {
                return reject('Invalid password!')
            }

            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 60 * 60 * 24 * 30
            })

            const data = user.toJSON()
            delete data.password
            data.accessToken = token
            resolve(data)
        })
    })
}

const verifyToken = token => {
    return new Promise((resolve, reject) => {
        if (!token) {
            return reject()
        }
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return reject(err)
            }

            const userId = decoded.id
            User.findById(userId).populate('role').exec((err, user) => {
                if (err) {
                    return reject(err)
                }

                if (!user) {
                    return reject('User not found.')
                }

                resolve(user.toJSON())
            })
        })
    })
}

module.exports = {
    register,
    login,
    verifyToken
}
