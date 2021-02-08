const express = require('express')
const controller = require('../controllers/magicbox')
const { verifyToken, isAdmin } = require('../middlewares/auth')
const { magicBoxNotRegistered } = require('../middlewares/magicbox')
const router = express.Router()

router.get('/', [verifyToken], controller.getMagicBox)
router.get('/contacts', [verifyToken], controller.getMagicBoxContacts)
router.post('/', [verifyToken], controller.addMagicBox)
router.post(
    '/register',
    [verifyToken, isAdmin, magicBoxNotRegistered],
    controller.registerMagicBox
)

module.exports = router
