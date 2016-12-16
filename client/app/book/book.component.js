'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './book.routes';

export class BookComponent {
  
  bookList = [];
  
  /*@ngInject*/
  constructor($scope, $http, socket) {
    this.$http = $http;
    
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('book');
    });
  }
  
  $onInit() {
    this.$http.get('/api/books')
      .then(response => {
        this.bookList = response.data;
        this.socket.syncUpdates('book', this.bookList);
      });
  }
  
}

export default angular.module('booksApp.book', [uiRouter])
  .config(routes)
  .component('book', {
    template: require('./book.html'),
    controller: BookComponent,
    controllerAs: 'bookCtrl'
  })
  .name;
