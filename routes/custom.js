const express = require('express');
const router = express.Router();
const controllers = require('../controllers/custom');

router.get('/', controllers.homeRoute);

router.get('/:listName', controllers.customRoute);

router.post('/', controllers.postHome);

router.post('/delete', controllers.delete);

module.exports = router;