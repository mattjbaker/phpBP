'use strict';


angular.module('articles')
        .config(['$stateProvider',
  function($stateProvider) {

    $stateProvider    
    .state('articles', {
        url: '/articles',
        templateUrl: 'packages/articles/view/articles.html',
        abstract:true
    })
    .state('articles.all',{
        url: '/all',
        templateUrl: 'packages/articles/view/articles-all.html'
    })
    .state('articles.create',{
        url: '/create',
        templateUrl: 'packages/articles/view/articles-create.html'
    })
    .state('articles.edit', {
        url: '/edit/:id',
        templateUrl: 'packages/articles/view/articles-create.html'
    })     
    .state('articles.one',{
        url: '/one/:id',
        templateUrl: 'packages/articles/view/articles-view.html'
    })
    .state('articles.view',{
        url: '/view',
        templateUrl: 'packages/articles/view/articles-view.html'
    })
    .state('articles.manage', {
        url: '/manage',
        data:{
            roles:['admin']
        },
        templateUrl: 'packages/articles/view/articles-manage.html'
    });
  }
]);