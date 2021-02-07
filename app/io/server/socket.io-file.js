const fs = require('fs')
const path = require('path')
const { nanoid } = require('nanoid')

const CHUNK_SIZE = 1 << 16
const fileRecords = {}

const mergeFileParts = (directory, metadata) => {
    const files = fs.readdirSync(directory)
    const stream = fs.createWriteStream(metadata.filename)

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

const receiveFile = (part, callback) => {
    const directory = `.tmp/${part.id}`
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true })
    }

    const filepath = path.join(directory, part.index.toString())
    fs.writeFile(filepath, part.chunk, err => {
        if (err) {
            return callback(err)
        }

        if (!fileRecords[part.id]) {
            fileRecords[part.id] = {
                counter: 0,
                metadata: null,
                total: null
            }
        }

        const record = fileRecords[part.id]

        if (part.metadata) {
            record.metadata = part.metadata
            record.total = part.index + 1
        }

        record.counter += 1

        if (record.counter == record.total) {
            const metadata = record.metadata
            delete fileRecords[part.id]
            mergeFileParts(directory, metadata)
            callback(null, metadata)
        }
    })
}

const sendFile = (socket, key, filepath, metadata) => {
    const length = fs.statSync(filepath).size
    const total = Math.floor(length / CHUNK_SIZE) + (length % CHUNK_SIZE > 0)
    const id = nanoid(5)
    let i = 0

    fs.createReadStream(filepath, { bufferSize: CHUNK_SIZE })
        .on('data', chunk => {
            const obj = { id, chunk, index: i }
            if (i == total - 1) {
                obj.metadata = metadata
            }
            i += 1
            socket.emit(key, obj)
        })
}

const siof = socket => {
    return {
        on: (key, callback) => {
            socket.on(key, part => {
                receiveFile(part, callback)
            })
        },
        emit: (key, filepath, metadata) => {
            sendFile(socket, key, filepath, metadata)
        }
    }
}

module.exports = siof
