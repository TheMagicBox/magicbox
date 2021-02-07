const { verifyToken } = require('../middlewares/auth')

module.exports = io => {
    io.use(verifyToken)
    io.on('connection', () => {
        // socket.on(...)
    })
}
