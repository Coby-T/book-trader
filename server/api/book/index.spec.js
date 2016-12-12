'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var bookCtrlStub = {
  index: 'bookCtrl.index',
  show: 'bookCtrl.show',
  create: 'bookCtrl.create',
  upsert: 'bookCtrl.upsert',
  patch: 'bookCtrl.patch',
  destroy: 'bookCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var bookIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './book.controller': bookCtrlStub
});

describe('Book API Router:', function() {
  it('should return an express router instance', function() {
    expect(bookIndex).to.equal(routerStub);
  });

  describe('GET /api/books', function() {
    it('should route to book.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'bookCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/books/:id', function() {
    it('should route to book.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'bookCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/books', function() {
    it('should route to book.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'bookCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/books/:id', function() {
    it('should route to book.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'bookCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/books/:id', function() {
    it('should route to book.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'bookCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/books/:id', function() {
    it('should route to book.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'bookCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
