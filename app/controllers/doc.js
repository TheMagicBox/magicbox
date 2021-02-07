const PrettyTable = require('prettytable')
const doc = (() => {
    const table = new PrettyTable()
    table.create(
        ['Method', 'Path', 'Parameters', 'Authentication', 'Description'],
        [
            ['GET', '/api', '', 'None', 'Get the API documentation.'],
            ['POST', '/api/auth/signup', 'username: String, password: String [, role: String]', 'None', 'Create an account.'],
            ['POST', '/api/auth/signin', 'username: String, password: String', 'None', 'Sign in to an account.'],
            ['GET', '/api/magicbox', '', 'None', 'Get MagicBox details.'],
            ['POST', '/api/magicbox/register', 'name: String', 'None', 'Register MagicBox for a public url.'],
            ['POST', '/api/magicbox/expose', '', 'None', 'Expose MagicBox to the internet.']
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
