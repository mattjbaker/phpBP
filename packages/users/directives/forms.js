'use strict';
/* 
 * User forms in directives.
 */

// user login directive
angular.module('users')
        .directive('loginForm',
        function(){
        return {
            restrict:    'E',
            templateUrl: 'packages/users/view/partials/login.html',
            link: function(scope,element,attrs){
                
                element.bind('hover',function(){
                   alert("Test"); 
                });
                
            }
        };  
    }            
);

// register new user directive.
angular.module('users')
        .directive('registerForm',
        function(){
            return{
                
        };
    }
);