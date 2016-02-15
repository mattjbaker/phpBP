/* 
 * Created by Matt Baker 2015
 */

// register new user directive.
angular.module('system')
        .directive('crumbNav',
        function(){
            return{
                restrict: 'E',
                scope:{},
                controller : "@",
                name:"controllerName", 
                templateUrl: 'nav-crumb'
        };
    }
);


angular.module('system')
    .directive('autoDrop',['$timeout',
    function($timeout){
    return{
        link: function(scope,elem,attrs){
           elem.bind('mouseleave',function(){
              elem.children('.dropdown').removeClass('open');
           });
        }
    }; 
}]);


angular.module('system')
    .directive('navIcon',function(){
   
    return{
      link:function(scope,elem,attrs){
       elem.bind('click',function(){
           elem.toggleClass('active');         
        });
      }  
    };         
});