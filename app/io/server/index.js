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
    const progress = Object.fromEntries(folder.sharedWith.map(magicbox => {
        return [magicbox._id, 0]
    }))

    folder.sharedWith.forEach(magicbox => {
        const client = ioClient(magicbox.url)
        client.on('connect', () => {
            client.on('upload', result => {
                if (result.status == 'error') {
                    progress[magicbox._id] = -1
                    return socket.emit('share', helper.success(progress))
                }

                const { keyOn, keyOff } = result.data
                client.on(keyOn, result => {
                    progress[magicbox._id] = 1
                    socket.emit('share', helper.success(progress))
                    client.removeAllListeners(keyOn)
                    client.close()
                })
                siof(client).emit(keyOn, filepath, {
                    filename: path.basename(filepath)
                })
            })
            siof(client).emit('upload', folder._id)
        })
    })
}

module.exports = io => {
    io.use(verifyToken)
    io.on('connection', socket => {
        socket.on('upload', folderId => {
            Folder.findById(folderId, (err, folder) => {
                if (err) {
                    return socket.emit('upload', helper.error())
                }

                if (!folder) {
                    return socket.emit('upload', helper.error('Folder not found.'))
                }

                if (folder.owner._id != socket.user.id) {
                    return socket.emit('upload', helper.error('You are not the owner of that folder.'))
                }

                // const sender = '...'
                // if (!folder.sharedWith.find(magicbox => magicbox.url == sender)) {
                //     return socket.emit('share', helper.error('You don\'t have access to that folder.'))
                // }

                const keyOn = nanoid(5)
                const keyOff = `${keyOn}-off`
                const destination = path.join(STORAGE, folder.path)
                siof(socket).on(keyOn, destination, (err, metadata) => {
                    socket.emit(keyOn, helper.success())
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
