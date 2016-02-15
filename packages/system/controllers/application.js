'use strict';

// AuthController 
// Handles user logins and global scope values.
angular.module('system')
         .controller('AppController',['$rootScope','$scope','$state',
     'AUTH_EVENTS','AuthService','Session',
      function($rootScope,$scope,$state,
      AUTH_EVENTS,AuthService,Session){
        
       
       $rootScope.console = false;
        
       if(!Session.userId){
           AuthService.resumeSession();
        }
        
        // global method to redirect state on val = true
        $scope._redirect = function(val,state){
            if(val){
                return $state.go(state);             
            }else{
                return true;
            }
        };
        
        
        $scope._logout = function(){ 
             AuthService.logout();
             $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        };
        
        $scope._session = function(){
            return Session;
        };
        
        $scope._authorized = function(role){
            
            return AuthService.isAuthorized(role);  
        };
 
        $scope._authenticated = function(){
            return !!Session.userId;
        };
        
        $scope._console = function(){
           if($scope._authorized('admin') ||
              $scope._authenticated() || 
              $scope._hasJquery()){
                  return $rootScope.console;
              }
        };
        
        $scope._hasJquery = function(){
           return !!window.jQuery;  
        };
        
      }
  ]);
