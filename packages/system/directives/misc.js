'use strict';

       
       
// finish this later.       
// many of these are animations. 
// many of these use full jquery rather then
// the suggested angularjs jquery lite
angular.module('system')

// make this just the chlid button with an invisible hit area and fade animations.
// create another directive with a timeout for mousover entire container to display buttons
// momentarily for interface hinting.


.directive('scrollOut',function(){
   return {

     link: function(scope, element,attrs){


        $(window).scroll(function () {
            var scrollTop = $(window).scrollTop();
            var height    = $(window).height() + 100;
            var opy = ((height-scrollTop) /height);
            element.css({
                'opacity': opy
            });

            if(opy <= 0){
                element.css('visibility','hidden');
            }else{
                element.css('visibility','visible');
            }
        });    
     }    
    };    
})
        
.directive('hideDiv',function(){
    return{
      scope:{
          hideDiv: '='
      },
      restrict: 'EA',
      link: function(scope,element,attrs){
            $(window).on('scroll', function () {
                if (scope.hideDiv <= $(window).scrollTop()) {
                   
                    element.css('visibility','hidden');
                } else {
                    // otherwise remove it
                    element.css('visibility','visible');
                }
            });
        }
    };
})

.directive('stopDiv',function(){
            return{
        scope:{
            stopDiv: '=',
            adjust: '='
        },
        restrict:'EA',
        link: function(scope,element,attrs){
           
            $(window).on('scroll', function () {
            if (scope.stopDiv <= $(window).scrollTop()) {
               
                // if so, add the fixed class
                var endpos = scope.stopDiv - scope.adjust;
            
                element.addClass('fixed');
               
                element.css('top','-'+endpos+"px");
            } else {
                // otherwise remove it
                element.removeClass('fixed');
            }
            });
        }               
     };
})


// Spin once animation
.directive('spinOnce',function($timeout){
        return{
            link:function(scope,element,attrs){

               $(element).on('mousedown',function(e){
                    $(element).find('i').addClass('fa-spin');
                    endit();
               });
               
               var endit = function(){
                 $timeout(function () {
                    $(element).find('i').removeClass('fa-spin');
                 }, 2000);
                };

        }
    };
})


//Spinning div animation
.directive('roller', function () {
    return {
        link: function ($scope, element, attrs) {

            $(window).scroll(function () {

                // get how far we've scrolled from the top of our screen
                var offset = $(window).scrollTop();
                offset = offset * 20;

                // apply the offset as a css transform to our buttons
                var val = offset + 'deg';
                $(element).css({                  
                    '-webkit-transform': 'rotate('+val+')'
                });
                
                $(element).css({  '-ms-transform': 'rotate('+val+')'});
                $(element).css({ 'transform': 'rotate('+val+')'});
            });
        }
    };
})



// Draggable elements.

.directive('switchForm',function(){
        return{
            restrict: 'A',
            link:function(scope,element){
               
                $(element).submit(function(){
                    $(element).find('input,button,textarea,select').attr('disabled',true);
                    $('.switch-back').show();
                }); 
            }
        };           
    }     
).directive('switchBack',function(){
    return{
      restrict: 'A',
      link: function(scope,element){
      
          $(element).click(function(){
             $('.switch-form').find('input,button,textarea,select').attr('disabled',false);
             $(this).hide();
          });
      }
    };
  }
)

//Spinning div animation
.directive('rollr', function () {
    return {
        link: function ($scope, element, attrs) {

            $(window).scroll(function () {

                // get how far we've scrolled from the top of our screen
                var offset = $(window).scrollTop();
                offset = offset * 20;

                // apply the offset as a css transform to our buttons
                $(element).css({
                    '-webkit-transform': 'rotate(' + offset + 'deg)'
                });

            });

        }
    };

})

.directive('isDragable', ['$document', function($document) {
    return {
      link: function(scope, element, attr) {
        var startX = 0, startY = 0, x = 0, y = 0;


        element.on('mousedown', function(event) {
          // Prevent default dragging of selected content
          event.preventDefault();
          startX = event.pageX - x;
          startY = event.pageY - y;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        });

        function mousemove(event) {
          y = event.pageY - startY;
          x = event.pageX - startX;
          element.css({
            top: y + 'px',
            left:  x + 'px'
          });
        }

        function mouseup() {
          $document.off('mousemove', mousemove);
          $document.off('mouseup', mouseup);
        }
        
        element.on('destroy',function(){
           element.unbind('mousedown');
        });
      }
    };
  }])
  
.directive('pageSet',function(){
    return{
        restrict: 'EA',
        repalce: true,
        transclude: true,
        template: '<input type="text" ng-model="pagination.current" class="select-page" ng-change="setCurrent(inputPage)">',
        link: function(scope,element,attrs){
            scope.$watch('pagination.current',function(c){
               scope.inputPage = c; 
            });
        }
    };
})

.directive('pageSelect', function() {
  return {
    restrict: 'EA',
    template: '<input tabindex="300" type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
    link: function(scope, element, attrs) {

      scope.$watch('currentPage', function(c) {
        scope.inputPage = c;
      });
    }
  };
})



.directive("contentEditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };
      

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
      
      element.$on('destory',function(){
          element.unbind('blur');
      });
    }
  };
});