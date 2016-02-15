'use strict';

angular.module('admin')
        .service('AdminService',['$http','$q','MSG','MessageService',
        function($http,$q,MSG,MessageService){
            
            var adminService = {};
            
            // Gets list array of api endpoints
            adminService.getApiEndpoints = function(){
               var deferred = $q.defer();
               $http.get('api/help/endpoints')
               .success(function(re){
                   deferred.resolve(re);
               }).error(function(er){
                   deferred.reject(er);
               });
               return deferred.promise;
            };
            
            return adminService;
        }
    ]);
    