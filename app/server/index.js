const auth = require('../controllers/auth')
const { verifyToken } = require('../middlewares')

module.exports = io => {
    io.use(verifyToken)
    io.on('connection', socket => {
        console.log('Client connected!')
        auth.onRegister(socket)
        auth.onLogin(socket)
    })
    console.log(`Listening on http://localhost:${process.env.SERVER_PORT}...`)
}
