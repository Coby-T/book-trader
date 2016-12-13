'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('book', {
      url: '/book',
      template: '<book></book>'
    });
}
