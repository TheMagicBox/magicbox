const express = require('express')
const controller = require('../controllers/folder')
const { verifyToken } = require('../middlewares/auth')
const { isFolderOwner } = require('../middlewares/folder')
const router = express.Router()

router.get('/', [verifyToken], controller.getFolders)
router.get('/:folderId', [verifyToken, isFolderOwner], controller.getFolderContent)
router.post('/', [verifyToken], controller.createFolder)
router.post('/share', [verifyToken, isFolderOwner], controller.shareFolder)

module.exports = router
