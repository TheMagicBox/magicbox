const express = require('express')
const controller = require('../controllers/user')
const { verifyToken } = require('../middlewares/auth')
const router = express.Router()

router.get('/', [verifyToken], controller.getUser)
router.get('/:username', controller.getUserInformationFromName)

module.exports = router
