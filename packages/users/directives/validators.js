/* 
 * Created by Matt Baker 2015
 * Directives for 'user' form validations
 *  maybe in the future i will create and interface for
 *  form validators but for now its just a bitch.
*/

'use strict';
angular.module('users')

// compares one form input to another for password confirmation etc.        
.directive('compareTo',['$q','$timeout', function($q,$timeout) {
    return {
        require: "ngModel",
        scope: {
           otherModelValue: '=compareTo'
        },
        link: function(scope, elem, attr, ngModel) {

           ngModel.$validators.compareTo = function(modelValue) {
                return modelValue === scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
}]);


angular.module('users')
.directive('userValidator',['$q','$timeout','UsersResource',
function( $q,$timeout,UsersResource) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {

        var fieldName = attrs.name;
        
        var checkSource = function(value){
            var deferred = $q.defer();
              UsersResource.verbkeyval.exists({},{verb:'exists',key:fieldName,val:value})
                .$promise.then(function(ret){
                    if(!ret.exists){
                        deferred.reject();
                     }
                     deferred.resolve();
                },function(){
                     deferred.resolve();
                });
            return deferred.promise;
        };
        
        ngModel.$asyncValidators.validuser =  function(modelValue, viewValue) {   
            
            if (!viewValue) {
                return $q.when(true);
            }
            var deferred = $q.defer();
            
            $timeout(function() {
                deferred.resolve(checkSource(viewValue));
            }, 1000);
            
            return deferred.promise;
        };
    }
    };
}]);
// validates only users form resources
angular.module('users')
.directive('uniqueValidator',['$q','$timeout','UsersResource',
function( $q,$timeout,UsersResource) {
    return {
        scope:{
          reverse: '=',
           ignore: '='
        },
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {

        var fieldName = attrs.name;
        
        var checkSource = function(value){
            var deferred = $q.defer();
              UsersResource.verbkeyval.exists({},{verb:'exists',key:fieldName,val:value})
                .$promise.then(function(ret){
                    if(!ret.exists){
                        deferred.resolve();
                     }
                     deferred.reject();
                },function(){
                     deferred.reject();
                });
            return deferred.promise;
        };
        
        var checkMatch = function(value){
            var deferred = $q.defer();
            if(angular.isDefined(scope.ignore.vals)){
                for(var i in scope.ignore.vals){
                    if(scope.ignore.vals[i] === value){
                        deferred.resolve();
                        return deferred.promise;
                    }
                }
            }
           deferred.resolve(checkSource(value));
            return deferred.promise;
        };
        
        ngModel.$asyncValidators[fieldName] =  function(modelValue, viewValue) {   
            
            if (!viewValue) {
                return $q.when(true);
            }
            var deferred = $q.defer();
            
            $timeout(function() {
                deferred.resolve(checkMatch(viewValue));
            }, 1000);
            
            return deferred.promise;
        };
    }
    };
}]);