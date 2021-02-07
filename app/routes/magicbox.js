const express = require('express')
const controller = require('../controllers/magicbox')
const { verifyToken, isAdmin } = require('../middlewares/auth')
const { isMagicBoxRegistered } = require('../middlewares/magicbox')
const router = express.Router()

router.get('/', [verifyToken], controller.getMagicBox)
router.post(
    '/register',
    [verifyToken, isAdmin, isMagicBoxRegistered],
    controller.registerMagicBox
)

module.exports = router
