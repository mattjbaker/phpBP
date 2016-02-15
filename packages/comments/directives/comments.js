/* 
 * Created by Matt Baker 2015
*/
'use strict';

angular.module('comments')

// configure the comments form. contains a view / form layout
.directive('commCont',
function(){
    return{
        restrict: 'EA',
        templateUrl: 'comments-cont',
        scope:{
           config: '=config'
        }
    };
})

// the guy that deals whith the collapsing nested comments.
.directive('collapser',['CommentsMapper','$timeout',function(CommentsMapper,$timeout){
    return{ 

        scope:{
             actOn: '=',
             depth: '=',
            vDepth: '='
        },
        link: function(scope,elem,attrs){
            
            var maxDepth  = scope.vDepth -1 || 0;
            var id        = ".st_"+scope.actOn;
            var c         = elem.children('<span');

            var _this     = {};
            _this.animate = function(delay){
                // the timeout provides enough delay to render the elements it acts upon.
                $timeout(function(){
                    if (CommentsMapper.collapsed[scope.actOn]) { 
                        c.children('.expand').removeClass('fa-caret-down').addClass('fa-caret-right');
                        $(id).css('opacity','0.4').css('border-bottom','1px solid #dddddd');
                        if ((!$(id).is(":hidden"))) {
                            $(id).slideUp('fast');
                        }
                    } else {
                        c.children('.expand').removeClass('fa-caret-right').addClass('fa-caret-down');
                         $(id).css('opacity','1').css('border','none');
                        if ($(id).is(":hidden")) {
                            $(id).slideDown("fast");
                        }
                    }
                },delay);
            };
            
            _this.update = function(){               
                if (scope.depth >= maxDepth && angular.isUndefined(CommentsMapper.collapsed[scope.actOn])) {
                    CommentsMapper.collapsed[scope.actOn] = true;
                }
            };
            
            elem.bind('click',function(){
              CommentsMapper.collapsed[scope.actOn] = (CommentsMapper.collapsed[scope.actOn])? false : true;         
              _this.update();   
              _this.animate(0);
            }); 
            _this.update();
            _this.animate(1);
          
        }
    };
}])

//auto focus the form input
.directive('focusMe', function() {
  return {
    scope: { trigger: '=focusMe' },
    link: function(scope, element) {
      scope.$watch('trigger', function(value) {
        if(value === true) { 
            element[0].focus();
            scope.trigger = false;
        }
      });
    }
  };
})

// this is the comments object that times compile with data bindings.
.directive('commObj',['$compile',
function($compile){
    return{
        restrict: 'EA',
        replace:  true,
        scope:{
             data:'='
        },
        link: function(scope,element,attrs){
           scope.parent   = scope.data.id; 
           scope.root     = scope.data.root;
           scope.level    = scope.data.lev + 1;
           scope.limit    = scope.data.limit;
           
           element.append("<comm-view root='root' limit='limit' level='level' parent='parent'></comm-view>");
           $compile(element.contents())(scope);  
        }
    };
}])

// sets up the standard view to be re-itterated per instance.
.directive('commView',
    function(){
        return{
        restrict:'EA', 
        scope:{
             parent: '=',
             level:  '=',
             root:   '=',
            limit:   '='
        },
        controller:  'CommentsViewContoller',
        templateUrl: 'comments-view'
    };
})


.directive('commForm',
function(){
    return{
        restrict:'EA',
        transclude:true,
           replace:true,
        scope:{
            parent: '=',
           visible: '=',
              root: '='
        },
        controller: 'CommentsFormController',
        templateUrl:'comments-form',
        link: function(scope,elem,atrrs){
            scope.toggleform = function(){
                scope.visible = (scope.visible)? false : true;
            };
            
        }
        
    };
});
