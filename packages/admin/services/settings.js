'use strict';

angular.module('admin')
    .service('SettingsService',['$http','$q','MSG','MessageService',
    function($http,$q,MSG,MessageService){
        
        var settingsService = {};
          
        // Save new site settings.
        settingsService.update = function(newset){  
    
           var deferred = $q.defer();  
       
           $http.post('api/settings/save',{settings:newset})
                   .success(function(result){  
                       MessageService.addMessage([MSG.KEYS.settingsSuccess],result,
                       MSG.CLASS.alertSuccess);
                       deferred.resolve(result); 
                   }).error(function(error){
                       deferred.reject(error);
                   });
                   return deferred.promise;
        };
      
      
        settingsService.getBackups = function(){
            var deferred = $q.defer();
            $http.get('api/settings/backups')
                .success(function(result){
                    deferred.resolve(result);
                }).error(function(error){
                    deferred.reject(error);
            });
         
            return deferred.promise;
        };
        
        // Get all system settings values
        settingsService.getSettings = function(){
           var deferred = $q.defer();
            $http.get('api/settings/all')
                    .success(function(result){  
                       deferred.resolve(result);
                    })
                    .error(function(error){
                        MessageService.addMessage([MSG.KEYS.settingsErr],error,
                        MSG.CLASS.alertError);
                        deferred.reject(error);
                     
                    });
                    return deferred.promise;  
        };
        
        return settingsService;
    }

]);