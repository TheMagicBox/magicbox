const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config/auth')
const formatter = require('../utils/formatter')
const db = require('../models')

const User = db.User
const Role = db.Role
const ROLES = db.ROLES

const onRegister = socket => {
    socket.on('register', (username, password) => {
        Role.findOne({ name: ROLES.user }, (err, role) => {
            if (err) {
                return socket.emit('register', formatter.error(err))
            }

            User.findOne({ username }).exec((err, user) => {
                if (err) {
                    return socket.emit('register', formatter.error(err))
                }

                if (user) {
                    return socket.emit(
                        'register',
                        formatter.error('Username already exists!')
                    )
                }

                new User({
                    username: username,
                    password: bcrypt.hashSync(password, 8),
                    role: role._id
                })
                .save((err, user) => {
                    if (err) {
                        return socket.emit('register', formatter.error(err))
                    }

                    const data = user.toJSON()
                    delete data.password
                    return socket.emit('register', formatter.success(data))
                })
            })
        })
    })
}

const onLogin = socket => {
    socket.on('login', (username, password) => {
        User.findOne({ username }).populate('role').exec((err, user) => {
            if (err) {
                return socket.emit('login', formatter.error(err))
            }

            if (!user) {
                return socket.emit('login', formatter.error('User not found.'))
            }

            if (!bcrypt.compareSync(password, user.password)) {
                return socket.emit(
                    'login',
                    formatter.error('Invalid password!')
                )
            }

            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 60 * 60 * 24 * 7
            })

            socket.user = {
                id: user.id,
                isAdmin: user.role.name == ROLES.admin
            }

            const data = user.toJSON()
            delete data.password
            data.accessToken = token
            return socket.emit('login', formatter.success(data))
        })
    })
}

module.exports = {
    onRegister,
    onLogin
}
