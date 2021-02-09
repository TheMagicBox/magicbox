const express = require('express')
const router = express.Router()

router.use('/', require('./doc'))
router.use('/auth', require('./auth'))
router.use('/users', require('./user'))
router.use('/magicbox', require('./magicbox'))
router.use('/folders', require('./folder'))
router.use((_, res) => res.status(404).send('Cannot find requested route.'))

module.exports = router
