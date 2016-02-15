'use strict';

angular.module('users')
        .config(['$stateProvider',
  function($stateProvider) {
      
    // Check if the user is connected
    // states for my app
    
    $stateProvider    
    // if users namespace is need for views.

    .state('users',{
        url: '/users',
        templateUrl: 'packages/users/view/users.html',
        abstract: true
    })
            .state('testauth',{
                controller: 'TestAuthController',
                url: '/testauth',
                templateUrl:'packages/users/view/testauth.html'
            })
    .state('reset',{
        url:'/reset/:hashkey',
        templateUrl: 'packages/users/view/users-reset.html'
    })
    .state('forgot', {
        url: '/forgot',
        templateUrl: 'packages/users/view/users-forgot.html'
    })
    .state('users.password',{
        url: '/password',
        templateUrl: 'packages/users/view/users-newpass.html'
    })
    .state('register', {
        url: '/register',
        controller: 'UsersRegisterController',
        templateUrl: 'packages/users/view/users-register.html'
    })
    .state('users.account', {
        url: '/account',
        controller: 'UsersEditAccountController',
        templateUrl: 'packages/users/view/users-form.html'
    })
    .state('login', {
        url: '/login',
        templateUrl: 'packages/users/view/users-login.html'

    }).state('users.profile', {
        url: '/profile',
        templateUrl: 'packages/users/view/users-profile.html'
    });
  }
]);