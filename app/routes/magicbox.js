const express = require('express')
const controller = require('../controllers/magicbox')
const { verifyToken, isAdmin } = require('../middlewares/auth')
const router = express.Router()

router.get('/', [verifyToken], controller.getMagicBox)
router.post('/register', [verifyToken, isAdmin], controller.registerMagicBox)
router.post('/expose', [verifyToken, isAdmin], controller.exposeMagicBox)

module.exports = router
