require('dotenv').config()
const fs = require('fs')
const path = require('path')
const io = require('socket.io')(process.env.SERVER_PORT)
const db = require('./models')
const server = require('./server')
const { initializeDatabase } = require('./initdb')

const mongoHost = process.env.MONGO_HOST
const mongoPort = process.env.MONGO_PORT
const mongoUsername = process.env.MONGO_USERNAME
const mongoPassword = process.env.MONGO_PASSWORD
const mongoDatabase = process.env.MONGO_DATABASE
const url = `mongodb://${mongoHost}:${mongoPort}/${mongoDatabase}`

db.mongoose.connect(url, {
    auth: {
      authSource: 'admin'
    },
    user: mongoUsername,
    pass: mongoPassword,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(client => {
    const STORAGE = path.join(process.cwd(), process.env.STORAGE_DIRECTORY)
    if (!fs.existsSync(STORAGE)) {
        fs.mkdirSync(STORAGE, { recursive: true })
    }
    initializeDatabase()
    server(io)
})
.catch(console.error)
