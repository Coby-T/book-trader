'use strict';

var express = require('express');
var controller = require('./request.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.indexUser);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/', auth.isAuthenticated(), controller.accept);

/*router.get('/', controller.index);
router.get('/:id', controller.show);

router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);*/

module.exports = router;
