'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('profile', {
      url: '/profile/:stuff',
      template: '<profile></profile>'
    });
}
