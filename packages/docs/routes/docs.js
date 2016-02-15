'use strict';

angular.module('docs')
        .config(['$stateProvider',
  function($stateProvider) {

    $stateProvider    
    .state('docs', {
        url: '/docs',
        templateUrl: 'packages/docs/view/docs.html',
        abstract:true
    })
    .state('docs.index',{
        url: '/index',
        templateUrl: 'packages/docs/view/docs-index.html'
    })
    .state('docs.services',{
        url: '/services',
        templateUrl: 'packages/docs/view/api-index.html'
    })
    .state('docs.compile', {
        url: '/compile',
        templateUrl: 'packages/docs/view/docs-compile.html'
    })     
    .state('docs.angular',{
        url: '/angular',
        templateUrl: 'packages/docs/view/docs-angular.html'
    })
    .state('docs.server',{
        url: '/server',
        templateUrl: 'packages/docs/view/docs-server.html'
    });

  }
]);