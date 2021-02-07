const PrettyTable = require('prettytable')
const doc = (() => {
    const table = new PrettyTable()
    table.create(
        ['Method', 'Path', 'Parameters', 'Authentication', 'Description'],
        [
            ['GET', '/api', '', 'None', 'Get the API documentation.'],
            ['POST', '/api/auth/signup', 'username: String, password: String', 'None', 'Create an account.'],
            ['POST', '/api/auth/signin', 'username: String, password: String', 'None', 'Sign in to an account.'],
            ['GET', '/api/magicbox', '', 'User', 'Get MagicBox details.'],
            ['POST', '/api/magicbox', 'name: String, url: String', 'User', 'Add a MagicBox contact.']
            ['POST', '/api/magicbox/register', 'name: String', 'Admin', 'Register MagicBox for a public url.'],
        ]
    )
    return table.toString()
})()

const getDoc = (req, res) => {
    res.send(`<pre>${doc}</pre>`)
}

module.exports = {
    getDoc
}
