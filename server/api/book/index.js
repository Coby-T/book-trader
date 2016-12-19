'use strict';

var express = require('express');
var controller = require('./book.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', controller.index);
router.get('/user', auth.isAuthenticated(), controller.indexUser);
router.get('/user/:id', auth.isAuthenticated(), controller.indexUser);
router.get('/show/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
//router.post('/trade/:id', controller.requests
//router.put('/:id', controller.upsert);
//router.patch('/:id', controller.patch);
router.delete('/delete/:id', controller.destroy);

module.exports = router;
