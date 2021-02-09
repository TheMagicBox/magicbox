const express = require('express')
const controller = require('../controllers/folder')
const { verifyToken } = require('../middlewares/auth')
const { isFolderOwner } = require('../middlewares/folder')
const { isMagicBoxRegistered } = require('../middlewares/magicbox')
const router = express.Router()

router.get('/', [verifyToken], controller.getFolders)
router.get('/:folderId', [verifyToken, isFolderOwner], controller.getFolderContent)
router.post('/', [verifyToken], controller.createFolder)
router.post('/share', controller.createFolderForSharing)
router.put('/share/:folderId', [verifyToken, isFolderOwner, isMagicBoxRegistered], controller.shareFolder)

module.exports = router
