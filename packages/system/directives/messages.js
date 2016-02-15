'use strict';

angular.module('system')
        .directive('standardMsg',['$timeout',
        function($timeout){
        return {
          restrict: "E",
          scope:{},
          transclude: true,
          controller : "@",
          name:"controllerName", 
          templateUrl: "msg-message",
          link: function(scope,element,attr){
              
            var msg_timeout = 7000;  
              
            scope.start = function(){
                $(element).fadeIn('fast');
                 $timeout(function(){
                 $(element).fadeOut('fast',null,function(){
                      scope.dismissAll();
                 });
              },msg_timeout);
            };
          
          }
        };  
    }            
]);
//
angular.module('system')
        .directive('modalMsg',['$modal','$timeout',
        function($modal,$timeout){
        return {
          restrict: "EA",
          scope:{
              controllerName: "@"
          },
          templateUrl: 'packages/system/view/partials/msg-modal.html',
          link: function(scope,element,attr){
    
                var modalInstance = $modal.open({
                        animation: scope.animationsEnabled,
                        templateUrl: 'myModalContent.html',
                        controller:  scope.controllerName,
                        size: 'small',
                        resolve: {

                        }
                }); 
            }

        };  
    }            
]);
