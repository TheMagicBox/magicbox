const express = require('express')
const controller = require('../../controllers/doc')
const router = express.Router()

router.get('/', (req, res) => {
    res.send(`<pre>${controller.doc}</pre>`)
})

module.exports = router
