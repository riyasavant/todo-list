const express = require('express');
const router = express.Router();
const customRouter = require('./custom');

router.use('/', customRouter);

module.exports = router;
