'use strict';

describe('Component: BookComponent', function() {
  // load the controller's module
  beforeEach(module('booksApp.book'));

  var BookComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    BookComponent = $componentController('book', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
