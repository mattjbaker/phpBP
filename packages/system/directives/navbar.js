//directives to deal with the navbar dropdown menus ... so we dont have to 
'use strict';

angular.module('system')

.directive('navbarRoot',['$timeout',function($timeout){
    return{
        restrict: 'A',
        link:function(scope,elem,attrs){
 
            
            var spans  = elem.children('<span');
            var carets = spans.children('<i');
           
            elem.bind('mouseover',function(){  
               // spans.addClass('animated').addClass('pulse');
               spans.addClass('big-font-hover');
                if(carets){
                    carets.removeClass('fa-caret-down').addClass('fa-caret-left');
                } 
            });
            elem.bind('mouseout',function(){
                spans.removeClass('big-font-hover');
                if(carets){
                    carets.removeClass('fa-caret-left').addClass('fa-caret-down');
                }
            });
        }
    };
}])
.directive('navbarMenu',function(){
    return{
      replace:    true,
      transclude: true,
      templateUrl: 'packages/system/view/partials/navbar-dropdown.html',
      link: function(scope,elem,attrs){
             elem.bind('mouseover',function(){    
              elem.children().addClass('animated').addClass('pulse');
            });
            elem.bind('mouseout',function(){
              elem.children().removeClass('animated').removeClass('pulse');
            });
      }
    };
})

// does the little flip on the gears.
.directive('navbarBrand',['$rootScope','$timeout',function($rootScope,$timeout){
    return{
        link:function(scope,elem,attrs){
            
            $rootScope.$on('$stateChangeSuccess',function(){
                $timeout(function(){
                    elem.addClass('flip');
                },50);
            });
            
            $rootScope.$on('$stateChangeStart',function(){
                elem.removeClass('flip'); 
            });
        }

    };
}]);

