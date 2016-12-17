'use strict';

var express = require('express');
var controller = require('./book.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/user/:id', controller.indexUser);
router.get('/show/:id', controller.show);
router.post('/', controller.create);
router.post('/trade/:id', controller.request);
//router.put('/:id', controller.upsert);
//router.patch('/:id', controller.patch);
router.delete('/delete/:id', controller.destroy);

module.exports = router;
