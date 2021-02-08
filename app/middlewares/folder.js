const db = require('../models')

const Folder = db.Folder

const isFolderOwner = (req, res, next) => {
    const folderId = req.params.folderId
    Folder.findById(folderId)
    .populate('owner')
    .exec((err, folder) => {
        if (err) {
            return res.status(500).end()
        }

        if (!folder) {
            return res.status(404).send('Folder not found.')
        }

        if (folder.owner._id != req.user.id) {
            return res.status(401).send('You are not the owner of this folder.')
        }

        req.folder = folder.toJSON()
        next()
    })
}

module.exports = {
    isFolderOwner
}
