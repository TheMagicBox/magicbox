const express = require('express')
const controller = require('../controllers/cert')
const router = express.Router()

router.get('/', controller.getPublicKey)

module.exports = router
