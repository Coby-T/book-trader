/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/books              ->  index
 * GET     /api/books/user         ->  indexUser
 * GET     /api/books/user/:id     ->  indexUser
 * GET     /api/books/show/:id     ->  show
 * POST    /api/books              ->  create
 * POST    /api/books/trade        ->  trade
 * DELETE  /api/books/delete/:id   ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Book from './book.model';

var google = require('googleapis');
var googleBooks = google.books('v1');

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

// Gets a list of Books
export function index(req, res) {
  return Book.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Books from user
export function indexUser(req, res) {
  var user = req.params.id || req.user._id;
  return Book.find({owner: user}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Book from the DB
export function show(req, res) {
  return Book.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Book in the DB
export function create(req, res) {
  if(!process.env.GOOGLE_API_KEY) {
    console.log('No Google API authorization.');
    handleError(res);
  }
  googleBooks.volumes.list({
    key: process.env.GOOGLE_API_KEY,
    q: req.body.search
  }, function(err, bookList) {
    if(err) throw err;
    return Book.create({
        title: bookList.items[0].volumeInfo.title,
        authors: bookList.items[0].volumeInfo.authors,
        cover: bookList.items[0].volumeInfo.imageLinks.thumbnail,
        description: bookList.items[0].volumeInfo.description ? bookList.items[0].volumeInfo.description : 'No description available...',
        owner: req.user._id
      })
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
  });
}

/*// Upserts the given Book in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Book.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Book in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Book.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
*/

// Deletes a Book from the DB
export function destroy(req, res) {
  if (Book.findById(req.params.id).owner == req.user._id) {
    return Book.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
  }
}

// Initiates or ends trade for Book in DB
export function trade(req, res) {
  var book1 = req.body.book1;
  var book2 = req.body.book2;
  var owner1 = req.body.owner1;
  var owner2 = req.body.owner2;
  if (req.body.request) {
    Book.findByIdAndUpdate(book1, {inTrade: true});
    Book.findByIdAndUpdate(book2, {inTrade: true});
  }
  else if (req.body.accept) {
    Book.findByIdAndUpdate(book1, {owner: owner2, inTrade: false});
    Book.findByIdAndUpdate(book2, {owner: owner1, inTrade: false});
  }
  else {
    Book.findByIdAndUpdate(book1, {inTrade: false});
    Book.findByIdAndUpdate(book2, {inTrade: false});
  }
  
}