'use strict';

angular.module('system')
.directive('registerForm',function(){
    return{
        templateURL: "packages/users/view/register.html",
        controller:  'RegisterController'
    }; 
});

angular.module('system')
.directive('loginForm',function(){
   return{
        templateURL: "packages/users/view/login.html",
        controller:  'LoginController'
    };  
});