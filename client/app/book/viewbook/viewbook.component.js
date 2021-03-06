'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './viewbook.routes';

export class ViewbookComponent {
  bookData;
  bookId;
  
  /*@ngInject*/
  constructor($scope, $http, $stateParams) {
    this.$http = $http;
    this.$stateParams = $stateParams;
  }
  
  $onInit() {
    this.$http.get('/api/books/show/' + this.$stateParams.id)
      .then(response => {
        this.bookId = this.$stateParams.id;
        this.bookData = response.data;
      });
  }
  
  requestBook() {
    // build request endpoint
  }
}

export default angular.module('booksApp.viewbook', [uiRouter])
  .config(routes)
  .component('viewbook', {
    template: require('./viewbook.html'),
    controller: ViewbookComponent,
    controllerAs: 'viewbookCtrl'
  })
  .name;
