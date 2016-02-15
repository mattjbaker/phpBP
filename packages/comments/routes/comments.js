/* 
 * Created by Matt Baker 2015
 */
'use strict';

angular.module('comments')
    .config(['$stateProvider',
      function($stateProvider) {

        $stateProvider    
        .state('comments', {
            url: '/comments',
            abstract:true,
            templateUrl: 'packages/comments/view/comments.html'
        })
        .state('comments.main',{
            url: '/main/:id',
            templateUrl: 'packages/comments/view/comments-home.html'
        })
        .state('comments.manage',{
            url: '/manage',
            data: {
                    roles: ['admin']
                },
            templateUrl: 'packages/comments/view/comments-manage.html'         
        });
    }
]);


