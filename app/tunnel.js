const localtunnel = require('localtunnel')
const db = require('./models')

const MagicBox = db.MagicBox

exports.createTunnelIfRegistered = () => {
    MagicBox.findOne({ default: true }, (err, magicbox) => {
        if (err || !magicbox) {
            return
        }

        localtunnel({
            port: process.env.SERVER_PORT,
            host: process.env.MAGICBOX_SERVER,
            token: magicbox.tunnelToken
        }).then(tunnel => {
            console.log(`Exposed at ${tunnel.url}`)
        })
    })
}
