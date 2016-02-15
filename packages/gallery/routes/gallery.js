'use strict';


angular.module('gallery')
        .config(['$stateProvider',
  function($stateProvider) {

    $stateProvider    
    .state('gallery', {
        url: '/gallery',
        templateUrl: 'packages/gallery/view/gallery.html',
        abstract:true
    })
    .state('gallery.manage',{
        url: '/manage',
        templateUrl: 'packages/gallery/view/gallery-manage.html'
    });
  }
]);
