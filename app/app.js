require('dotenv').config()
const fs = require('fs')
const path = require('path')
const http = require('http')
const io = require('socket.io')
const express = require('express')
const bodyParser = require('body-parser')
const db = require('./models')
const { initializeDatabase } = require('./initdb')
const STORAGE = path.join(process.cwd(), process.env.STORAGE_DIRECTORY)

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
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(client => {
    if (!fs.existsSync(STORAGE)) {
        fs.mkdirSync(STORAGE, { recursive: true })
    }
    initializeDatabase()

    const app = express()
    const httpServer = http.createServer(app)
    const ioServer = io(httpServer)

    require('./io/server')(ioServer)
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use('/api', require('./routes/api'))
    httpServer.listen(process.env.SERVER_PORT, () => {
        console.log(`Listening at http://localhost:${process.env.SERVER_PORT}`)
    })
})
.catch(console.error)

module.exports = {
    STORAGE
}
