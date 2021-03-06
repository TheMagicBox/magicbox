const fs = require('fs')
const path = require('path')
const { nanoid } = require('nanoid')
const ioClient = require('socket.io-client')
const siof = require('./socket.io-file')
const db = require('../../models')
const { verifyToken } = require('../middlewares/auth')
const { STORAGE } = require('../../app')

const Folder = db.Folder

const helper = {
    success: data => {
        return {
            status: 'success',
            data: data
        }
    },
    error: message => {
        return {
            status: 'error',
            message: message
        }
    }
}

const shareFile = (socket, folder, filepath) => {
    const progress = folder.sharedWith.map(recipient => {
        return {
            magicbox: recipient.magicbox._id,
            progress: 0,
            status: 0
        }
    })

    folder.sharedWith.forEach((recipient, index) => {
        const { magicbox, folderId } = recipient
        const client = ioClient(magicbox.url)
        client.on('connect', () => {
            client.on('upload', result => {
                if (result.status == 'error') {
                    progress[index].status = -1
                    return socket.emit('share', helper.success(progress))
                }

                const { keyOn, keyOff } = result.data
                siof(client).emit(keyOn, filepath, {
                    filename: path.basename(filepath)
                }, (sent, total) => {
                    progress[index].progress = Math.floor(100 * sent / total)
                    socket.emit('share', helper.success(progress))
                }, () => {
                    progress[index].status = 1
                    socket.emit('share', helper.success(progress))
                    client.removeAllListeners(keyOn)
                    client.close()
                }, () => {
                    progress[index].status = -1
                    socket.emit('share', helper.success(progress))
                    client.emit(keyOff)
                    client.removeAllListeners(keyOn)
                    client.close()
                })
            })
            client.emit('upload', folderId)
        })
    })
}

module.exports = io => {
    io.use(verifyToken)
    io.on('connection', socket => {
        socket.on('upload', folderId => {
            Folder.findById(folderId)
            .populate({
                path: 'sharedWith',
                populate: {
                    path: 'magicbox'
                }
            })
            .exec((err, folder) => {
                if (err) {
                    return socket.emit('upload', helper.error())
                }

                if (!folder) {
                    return socket.emit('upload', helper.error('Folder not found.'))
                }

                if (socket.user) {
                    if (socket.user.id != folder.owner._id) {
                        return socket.emit('upload', helper.error('You are not the owner of that folder.'))
                    }
                } else {
                    // const sender = '...'
                    // if (!folder.sharedWith.find(magicbox => magicbox.url == sender)) {
                    //     return socket.emit('share', helper.error('You don\'t have access to that folder.'))
                    // }
                }

                const keyOn = nanoid(5)
                const keyOff = `${keyOn}-off`
                const destination = path.join(STORAGE, folder.path)
                siof(socket).on(keyOn, destination, (err, metadata) => {
                    socket.removeAllListeners(keyOn)
                    socket.removeAllListeners(keyOff)

                    if (socket.user) {
                        const filepath = path.join(destination, metadata.filename)
                        shareFile(socket, folder, filepath)
                    }
                })
                socket.on(keyOff, () => {
                    socket.removeAllListeners(keyOn)
                    socket.removeAllListeners(keyOff)
                })
                socket.emit('upload', helper.success({ keyOn, keyOff }))
            })
        })
    })
}
