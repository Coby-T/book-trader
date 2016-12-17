'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './profile.routes';

export class ProfileComponent {
  
  bookList = [];
  userInfo;
  userId;
  bookQuery;
  
  /*@ngInject*/
  constructor($scope, $http, $stateParams, socket, Auth) {
    this.$http = $http;
    this.userId = $stateParams.id ? $stateParams.id : Auth.getCurrentUser()._id;
    
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('book');
    });
  }
  
  $onInit() {
    this.$http.get('/api/users/me/')
      .then(response => {
        this.userInfo = response.data;
      });
    
    this.$http.get('/api/books/user/' + this.userId)
      .then(response => {
        this.bookList = response.data;
        this.socket.syncUpdates('book', this.bookList);
      });
  }
  
  addBook() {
    if(this.bookQuery) {
      this.$http.post('/api/books/', {search: this.bookQuery})
        .then(response => {
          if (response.data && response.data.title) {
            this.bookList.push(response.data);
            this.socket.syncUpdates('book', this.bookList);
          }
        });
    }
  }
}

export default angular.module('booksApp.profile', [uiRouter])
  .config(routes)
  .component('profile', {
    template: require('./profile.html'),
    controller: ProfileComponent,
    controllerAs: 'profileCtrl'
  })
  .name;
