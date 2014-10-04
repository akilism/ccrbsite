'use strict';

var express = require('express');
var controller = require('./precincts.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/shapes', controller.shapes);

module.exports = router;
