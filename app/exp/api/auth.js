const express = require('express')
const controller = require('../../controllers/auth')
const formatter = require('../../utils/formatter')
const router = express.Router()

router.post('/signup', (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.json(formatter.error('Missing: username, password'))
    }

    controller.signup(req.body.username, req.body.password)
        .then(user => {
            res.json(formatter.success(user))
        })
        .catch(err => {
            res.json(formatter.error(err))
        })
})

router.post('/signin', (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.json(formatter.error('Missing: username, password'))
    }

    controller.signin(req.body.username, req.body.password)
        .then(user => {
            res.json(formatter.success(user))
        })
        .catch(err => {
            res.json(formatter.error(err))
        })
})

module.exports = router
