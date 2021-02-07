const express = require('express')
const controller = require('../controllers/auth')
const { magicBoxNotRegistered } = require('../middlewares/magicbox')
const router = express.Router()

router.post('/signup', [magicBoxNotRegistered], controller.signUp)
router.post('/signin', controller.signIn)

module.exports = router
