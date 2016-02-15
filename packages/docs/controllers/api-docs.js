'use strict';

angular.module('docs')
.controller('ApiDocsController',['$scope','$http',
    function($scope,$http) {
       
       $scope.srv      = {};
       $scope.selected = {};
       $scope.args     = {};
       $scope.native_methods    = [];
       $scope.inherited_methods = [];
       $scope.parents           = [];

       $scope.construct = function(){
           $http.get('api/docs/services')
            .success(function(res){
                $scope.srv = res;
                $scope.select(0);
            });
            
            $http.get('api/docs/args')
                .success(function(res){
                $scope.args = res;
            });      
        };
        
        $scope.select = function(index){
            $scope.selected = {};
            $scope.selected = $scope.srv.services[index];
            $scope.getNativeMethods();
        };

        $scope.getNativeMethods = function(){
            $scope.native_methods = [];
            var comp = $scope.selected.service + "Api"; 
            angular.forEach( $scope.selected.methods, function(m){
                if(m.class === comp && m.interface){
                    if(m.interface.route){
                    $scope.native_methods.push(m);
                    }
                }
            });
        };
        
        $scope.getRels = function(rels){
            if(angular.isArray(rels)){
                var ret = null;
                angular.forEach(rels ,function(r){
                     ret = ret + r + "</br>";
                });
            return ret;
            }
            return rels;
        };
        
        $scope.statusStyle = function(status){
          if(status){
              return "error";
          }
          return "success";
        };
        
        $scope.methodStatus = function(status){
            if(status){
                return status;
            }
            return "Active";
        };

}]);