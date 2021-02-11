const fs = require('fs')
const path = require('path')
const { nanoid } = require('nanoid')

const CHUNK_SIZE = 500000

const receiveFile = (socket, key, destination, callback) => {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true })
    }

    const fid = `.${nanoid(10)}`
    const tmp = path.join(destination, fid)
    const stream = fs.createWriteStream(tmp)

    socket.on(key, part => {
        if (part.metadata) {
            stream.close()
            fs.renameSync(tmp, path.join(destination, part.metadata.filename))
            socket.emit(`${key}:${part.id}:end`)
            callback(null, part.metadata)
        } else {
            stream.write(part.chunk)
            socket.emit(`${key}:${part.id}:next`)
        }
    })
}

const sendFile = (socket, key, filepath, metadata, onProgress, onDone, onCanceled) => {
    const id = nanoid(5)
    const onNextKey = `${key}:${id}:next`
    const onAbortKey = `${key}:${id}:abort`
    const onEndKey = `${key}:${id}:end`
    const buffer = new Buffer(CHUNK_SIZE)
    const filesize = fs.statSync(filepath).size
    const fd = fs.openSync(filepath)
    let bytesRead = 0
    let bytesSent = 0

    const removeAllListeners = () => {
        socket.removeAllListeners(onNextKey)
        socket.removeAllListeners(onAbortKey)
        socket.removeAllListeners(onEndKey)
    }

    const sendNextChunk = () => {
        bytesRead = fs.readSync(fd, buffer, 0, CHUNK_SIZE, null)
        bytesSent += bytesRead
        if (bytesRead > 0) {
            socket.emit(key, { id, chunk: buffer.slice(0, bytesRead) })
            onProgress(bytesSent, filesize)
        } else {
            socket.emit(key, { id, metadata })
            fs.closeSync(fd)
        }
    }

    const abortTransfer = () => {
        removeAllListeners()
        fs.closeSync(fd)
        onCanceled()
    }

    const endTransfer = () => {
        removeAllListeners()
        onDone()
    }

    socket.on(onNextKey, sendNextChunk)
    socket.on(onAbortKey, abortTransfer)
    socket.on(onEndKey, endTransfer)
    sendNextChunk()
}

const siof = socket => {
    return {
        on: (key, destination, callback) => {
            receiveFile(socket, key, destination, callback)
        },
        emit: (key, filepath, metadata, onProgress, onDone, onCanceled) => {
            sendFile(socket, key, filepath, metadata, onProgress, onDone, onCanceled)
        }
    }
}

module.exports = siof
