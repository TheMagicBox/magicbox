const fs = require('fs')
const path = require('path')
const { nanoid } = require('nanoid')

const CHUNK_SIZE = 500000

const createDirIfNotExistsRecursive = directory => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true })
    }
}

const mergeFileParts = (directory, destination) => {
    const files = fs.readdirSync(directory)
    const stream = fs.createWriteStream(destination)

    files.map(str => parseInt(str))
        .sort((a, b) => a - b)
        .forEach(filename => {
            const filepath = path.join(directory, filename.toString())
            stream.write(fs.readFileSync(filepath))
            fs.unlinkSync(filepath)
        })

    fs.rmdirSync(directory)
    stream.close()
}

const receiveFile = (socket, key, destination, callback) => {
    socket.on(key, part => {
        const directory = `.tmp/${part.id}`
        createDirIfNotExistsRecursive(directory)

        if (part.metadata) {
            const filepath = path.join(destination, part.metadata.filename)
            createDirIfNotExistsRecursive(destination)
            mergeFileParts(directory, filepath)
            socket.emit(`${key}:${part.id}:end`)
            return callback(null, part.metadata)
        }

        const filepath = path.join(directory, part.i.toString())
        fs.writeFile(filepath, part.chunk, err => {
            if (err) {
                socket.emit(`${key}:${part.id}:abort`)
                return callback(err)
            }
        })

        socket.emit(`${key}:${part.id}:next`)
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
    let i = 0

    const removeAllListeners = () => {
        socket.removeAllListeners(onNextKey)
        socket.removeAllListeners(onAbortKey)
        socket.removeAllListeners(onEndKey)
    }

    const sendNextChunk = () => {
        bytesRead = fs.readSync(fd, buffer, 0, CHUNK_SIZE, null)
        bytesSent += bytesRead
        if (bytesRead > 0) {
            socket.emit(key, { id, chunk: buffer.slice(0, bytesRead), i: i++ })
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
