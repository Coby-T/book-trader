'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './profile.routes';

export class ProfileComponent {
  
  bookList = [];
  userInfo;
  userId;
  bookQuery;
  isUser = false;
  
  /*@ngInject*/
  constructor($scope, $http, $stateParams, socket, Auth) {
    this.$http = $http;
    this.$stateParams = $stateParams;
    this.Auth = Auth;
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('book');
    });
  }
  
  $onInit() {
    this.Auth.getCurrentUser().then(user => {
      if (!this.$stateParams.id || this.$stateParams.id == user._id) {
        this.isUser = true;
        this.$http.get('/api/books/user/')
          .then(response => {
            console.log("mine");
            this.bookList = response.data;
            this.socket.syncUpdates('book', this.bookList);
          });
        this.$http.get('/api/users/me/')
          .then(response => {
            this.userInfo = response.data;
          });
      }
      else {
        this.$http.get('/api/books/user/' + this.$stateParams.id)
          .then(response => {
            console.log("not mine");
            this.bookList = response.data;
            this.socket.syncUpdates('book', this.bookList);
          });
        this.$http.get('/api/users/' + this.$stateParams.id)
          .then(response => {
            this.userInfo = response.data;
          });
      }
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
