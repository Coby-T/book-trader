'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './book.routes';

export class BookComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
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
