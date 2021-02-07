const PrettyTable = require('prettytable')

const doc = (() => {
    const table = new PrettyTable()
    table.create(
        ['Method', 'Path', 'Parameters', 'Authentication', 'Description'],
        [
            ['GET', '/api', '', 'None', 'Get the API documentation.'],
            ['POST', '/api/auth/signup', 'username: String, password: String [, role: String]', 'None', 'Create an account.'],
            ['POST', '/api/auth/signin', 'username: String, password: String', 'None', 'Sign in to an account.']
        ]
    )
    return table.toString()
})()

module.exports = { doc }
