require('dotenv').config()
const fs = require('fs')
const path = require('path')
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const db = require('./models')
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
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(client => {
    const STORAGE = path.join(process.cwd(), process.env.STORAGE_DIRECTORY)
    if (!fs.existsSync(STORAGE)) {
        fs.mkdirSync(STORAGE, { recursive: true })
    }
    initializeDatabase()

    require('./io/server')(io)
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use('/api', require('./routes/api'))
    server.listen(process.env.SERVER_PORT, () => {
        console.log(`Listening at http://localhost:${process.env.SERVER_PORT}`)
    })
})
.catch(console.error)
