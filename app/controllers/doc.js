const PrettyTable = require('prettytable')
const doc = (() => {
    const table = new PrettyTable()
    table.create(
        ['Method', 'Path', 'Parameters', 'Authentication', 'Description'],
        [
            ['GET', '/api', '', 'None', 'Get the API documentation.'],
            ['GET', '/api/cert', '', 'None', 'Get the MagicBox public key.'],
            ['POST', '/api/auth/signup', 'username: String, password: String', 'Admin', 'Create an account.'],
            ['POST', '/api/auth/signin', 'username: String, password: String', 'None', 'Sign in to an account.'],
            ['GET', '/api/users', '', 'User', 'Get User details.'],
            ['GET', '/api/users/:username', '', 'None', 'Get User information by account name.'],
            ['GET', '/api/magicbox', '', 'User', 'Get MagicBox details.'],
            ['POST', '/api/magicbox', 'name: String, url: String, account: String', 'User', 'Add a MagicBox contact.'],
            ['GET', '/api/magicbox/contacts', '', 'User', 'Get MagicBox contacts.'],
            ['POST', '/api/magicbox/register', 'name: String', 'Admin', 'Register MagicBox for a public url.'],
            ['GET', '/api/folders', '', 'User', 'Get folders list.'],
            ['POST', '/api/folders', 'name: String', 'User', 'Create a new folder.'],
            ['GET', '/api/folders/:folderId', '', 'User', 'Get folder content.'],
            ['POST', '/api/folders/share', 'name: String, folderId: String', 'MagicBox Signature', 'Request the creation of a shared folder.'],
            ['PUT', '/api/folders/share/:folderId', 'magicboxIds: [String]', 'User', 'Share a folder.']
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
