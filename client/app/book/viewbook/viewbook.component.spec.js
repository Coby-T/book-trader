'use strict';

describe('Component: ViewbookComponent', function() {
  // load the controller's module
  beforeEach(module('booksApp.viewbook'));

  var ViewbookComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ViewbookComponent = $componentController('viewbook', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
