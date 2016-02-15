'use strict';

angular.module('system')
    .controller('GlobalMessageController',['$scope','MSG','MessageService',
    function($scope,MSG,MessageService){
        MessageService.init($scope,true);
        MessageService.getMessages($scope,[MSG.KEYS.globalMsg]); 
    }
]);

//This is the controller for a standard modal message Instance.
angular.module('system')
.controller('ModalInstanceController',['$scope',
'$modalInstance','MSG','MessageService',
     function ($scope, $modalInstance,MSG,MessageService) {
     
     MessageService.init($scope,true);
     MessageService.getMessages($scope,[MSG.KEYS.globalMsg]);    
 
   
    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
