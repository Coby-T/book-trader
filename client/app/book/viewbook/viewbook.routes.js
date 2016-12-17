'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('viewbook', {
      url: '/viewbook/:id',
      template: '<viewbook></viewbook>'
    });
}
