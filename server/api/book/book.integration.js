'use strict';

var app = require('../..');
import request from 'supertest';

var newBook;

describe('Book API:', function() {
  describe('GET /api/books', function() {
    var books;

    beforeEach(function(done) {
      request(app)
        .get('/api/books')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          books = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(books).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/books', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/books')
        .send({
          name: 'New Book',
          info: 'This is the brand new book!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newBook = res.body;
          done();
        });
    });

    it('should respond with the newly created book', function() {
      expect(newBook.name).to.equal('New Book');
      expect(newBook.info).to.equal('This is the brand new book!!!');
    });
  });

  describe('GET /api/books/:id', function() {
    var book;

    beforeEach(function(done) {
      request(app)
        .get(`/api/books/${newBook._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          book = res.body;
          done();
        });
    });

    afterEach(function() {
      book = {};
    });

    it('should respond with the requested book', function() {
      expect(book.name).to.equal('New Book');
      expect(book.info).to.equal('This is the brand new book!!!');
    });
  });

  describe('PUT /api/books/:id', function() {
    var updatedBook;

    beforeEach(function(done) {
      request(app)
        .put(`/api/books/${newBook._id}`)
        .send({
          name: 'Updated Book',
          info: 'This is the updated book!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedBook = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBook = {};
    });

    it('should respond with the updated book', function() {
      expect(updatedBook.name).to.equal('Updated Book');
      expect(updatedBook.info).to.equal('This is the updated book!!!');
    });

    it('should respond with the updated book on a subsequent GET', function(done) {
      request(app)
        .get(`/api/books/${newBook._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let book = res.body;

          expect(book.name).to.equal('Updated Book');
          expect(book.info).to.equal('This is the updated book!!!');

          done();
        });
    });
  });

  describe('PATCH /api/books/:id', function() {
    var patchedBook;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/books/${newBook._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Book' },
          { op: 'replace', path: '/info', value: 'This is the patched book!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedBook = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedBook = {};
    });

    it('should respond with the patched book', function() {
      expect(patchedBook.name).to.equal('Patched Book');
      expect(patchedBook.info).to.equal('This is the patched book!!!');
    });
  });

  describe('DELETE /api/books/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/books/${newBook._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when book does not exist', function(done) {
      request(app)
        .delete(`/api/books/${newBook._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
