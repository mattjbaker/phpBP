'use strict';


angular.module('system')

// show or hide a single password field.
.directive('showBtn',function(){
      return{
          restrict: 'A',
          link:function(scope,elem,attrs){
              
            var isHidden = true;
            var input    = attrs.btnId;
            var link     = attrs.linkId;

            var update = function(id){
                if(!isHidden){
                    $('#'+link).attr('type','text');
                    $('#'+input).attr('type','text');
                    elem.html("<i class='fa fa-eye'></i>");
                }else{      
                    $('#'+link).attr('type','password');
                    $('#'+input).attr('type','password');
                    elem.html('<i class="fa fa-eye-slash"></i>');
                }
            };
          
            elem.bind('click',function(){
                isHidden = (!isHidden)? true : false;
                update();
            });
    
            update();
            
            scope.$on('$destroy', function() {
                elem.unbind('blur');
                elem.unbind('click');
            });
          }
    };
})

.directive('popoverit',function(){
    return{
        restrict:'A',
        link:function(scope,elem,attrs){
            $(elem).popover({
                trigger: 'hover',
                html: true,
                content:   attrs.popoverHtml,
                placement: attrs.popoverPlacement
            });
        }
    };
})
.directive('dualInput',function(){
    return{
        restrict: 'EA',

        scope:{
            isRequired: '=',
            names:      '=',
            holders:    '=',
            modelOne:   '=',
            modelTwo:   '=',
            symbolOne:  '=',
            symbolTwo:  '=',
            inputOne:    '=',
            inputTwo:    '='
  
        },
        templateUrl: 'packages/system/view/partials/input-dual.html',
        link:function(scope,elem,attrs){
            
            scope.isContent = function(symbol,id){
                if(symbol.class){
                   $('#'+id).html('<i class="'+symbol.class+'"></i>');
                }else{
                   $('#'+id).html(symbol.value);
               }
            }; 
        }
    };
})

.directive('showHide',function(){
    return{
        restrict: 'EA',
        scope:{
            cName:   '=',
            cId:     '=',
            model:   '=',
            cHolder: '='
        },
        templateUrl: 'packages/system/view/partials/input-password.html',
        link: function(scope,elem,attrs){
            scope.showpass = false;
            
            scope.showit= function(){
                scope.showpass = (scope.showpass)? false : true;
            };
        }
    };
});

angular.module('system')
        .directive("editableElement", function() {
  return {
    restrict: "A",
    require: '?ngModel',
    scope:{},
    link: function(scope, element, attrs, ngModel) {

      function removeShit(str) {
        return (''+str).replace(/&\w+;\s*/g, '');
      }

      function read() {
         var clean = removeShit(element.html());
             ngModel.$setViewValue(clean);
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue);
      };

      element.bind("blur", function() {
        scope.$apply(read);
      });
      
      ngModel.$render();
       // remove the attached events to element when destroying the scope
        scope.$on('$destroy', function() {
            element.unbind('blur');
            element.unbind('paste');
            element.unbind('focus');
        });
    }
  };
});