const jwt = require('jsonwebtoken')
const config = require('../config/auth')
const db = require('../models')

const ROLES = db.ROLES

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token']
    if (!token) {
        return res.status(401).send('No access token provided!')
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(400).send('Unauthorized!')
        }
        req.user = {
            id: decoded.id,
            role: decoded.role,
            name: decoded.name
        }
        next()
    })
}

const isAdmin = (req, res, next) => {
    if (req.user.role !== ROLES.admin) {
        return res.status(403).send('Reserved for admin!')
    }
    next()
}

module.exports = {
    verifyToken,
    isAdmin
}
