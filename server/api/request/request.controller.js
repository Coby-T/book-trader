/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/requests              ->  indexUser
 * PUT     /api/requests              ->  accept(or delete)
 * POST    /api/requests              ->  create
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Request from './request.model';
import Promise from 'bluebird';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Index all requests for the registered user
export function indexUser(req, res) {
  var id = req.user._id;
  var received = Request.find({receiver: id}).exec();
  var proposed = Request.find({proposer: id}).exec();
  
  return Promise.join(received, proposed)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));

}

// Accept or Decline an existing trade
export function accept(req, res) {
  Request.findById(req.body.requestId).exec()
    .then(removeEntity(res))
    .catch(handleError());
}

// Creates a new Request in the DB
export function create(req, res) {
  return Request.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

/*
// Gets a list of Requests
export function index(req, res) {
  return Request.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Request from the DB
export function show(req, res) {
  return Request.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}



// Upserts the given Request in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Request.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Request in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Request.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Request from the DB
export function destroy(req, res) {
  return Request.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
*/