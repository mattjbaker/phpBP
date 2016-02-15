'use strict';


angular.module('system')
.controller('HeaderController', ['$rootScope','$scope','Menus','Session',
     function($rootScope,$scope,Menus,Session) {
         
       var _this     = {};
       $scope.menu   = {};
       
       _this.compile = function(){
           $scope.menu.top  = Menus.getMenu('topbar');
           $scope.menu.user = Menus.getMenu('usermenu');
       };
        
        $scope.resolveMethod = function(method){
            if(method === 'console'){
              return $rootScope.console = (!$rootScope.console)? true : false;
            }
            return;
        };
        _this.compile();
     }
]);


angular.module('system')
        .controller('FooterController',['$scope',
    function($scope){
        $scope.text = "FOOTER";
    }
]);