const express = require('express')
const controller = require('../controllers/auth')
const router = express.Router()

router.post('/signup', controller.signUp)
router.post('/signin', controller.signIn)

module.exports = router
