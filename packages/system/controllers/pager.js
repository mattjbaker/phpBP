'use strict';

angular.module('system')
        .controller('PageController', ['$scope',
            function ($scope) {
                
               // I hate pagination that does not re-itterate
               $scope.loopBack = function(current,next,total){
                    if(current === total){
                        return 1;
                    }
                    if(current === 1){
                        return total;
                    }
                    return next;
               };
                
                $scope.nextPage = function(current,total){
                   return (current + 1 > total)? 1 : current + 1;
                };
                
                $scope.lastPage = function(current,total){
                    return (current - 1 < 1)? total : current - 1;
                };
                
            }
        ]);