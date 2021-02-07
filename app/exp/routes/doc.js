const express = require('express')
const controller = require('../controllers/doc')
const router = express.Router()

router.get('/', controller.getDoc)

module.exports = router
