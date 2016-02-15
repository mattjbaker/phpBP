'use strict';
// requires Utils service.


angular.module('admin')
        .directive('slected',function(){
            return{
                    scope:{selected: '='},
                    link: function(scope,element,attrs){
                        if(scope.selected === 0){
                            $(element).prop('selected');
                        }
                    }
            };
});

// switch for just the little lock thing
angular.module('admin')
.directive('lockSwitch', function () {
    return{
        restrict: 'EA',
        scope:{lockSwitch: '='},
        link: function (scope, element, attrs) {  
            
            scope.$watch('lockSwitch', function (e) {
                if (!scope.lockSwitch) {
                    element.html('<i class="fa fa-unlock"></i>');
                } else {
                    element.html('<i class="fa fa-lock"></i>');
                }
            });
        }
    };
});

// switch element for any button.
angular.module('admin')
.directive('btnSwitch', function () {
    return{
        restrict: 'EA',
        scope:{
            value: '=',
            btn:   '='
        },
        link: function (scope, element, attrs) {   
          
            //value , icnTrue, icnFalse, trueClass, falseClass, text
            scope.$watch('value', function (e) {
                if (!scope.value) {
                    element.html('<button class="switch"><i class="'+ scope.btn.icnFalse + ' '+ scope.btn.falseClass +'"></i> '+scope.btn.falseText+'</button>');
                } else {
                    element.html('<button class="switch"><i class="'+ scope.btn.icnTrue +' ' + scope.btn.trueClass +'"></i> '+scope.btn.trueText+'</button>');
                }
            });
        }
    };
});



// lock or unlock a form input
angular.module('admin')
    .directive('isEditable', function() {
      return {
          scope:{isEditable: '='},
          link: function(scope, element, attrs) {
            scope.$watch('isEditable',function(e){
                element.attr("readonly", e);
            });
        }
      };
});

// lock or unlock a button element.
angular.module('admin')
     .directive('isEnabled',function(){
      return{
     
        link:function(scope,element,attrs){
            scope.$watch('locked',function(e){
               element.attr('disabled',e); 
            });
        }  
      };
 });
    
// list creator with dropdown menu
angular.module('admin')
        .directive('dropdownInput',['Utils','$q',function(Utils,$q){
         return {
            scope:{
               locked: '=',
                items: '=',
                model: '=',
               remove: '=',
                 data: '=',
               values: '=',
                 name: '@',
              changed: '&'
              
            },
            restrict: 'EA',
            templateUrl:'packages/admin/view/partials/ctrl-list.html',
            link: function(scope,element,attr){
                
                scope.displayItems = [];    
               
                if(angular.isArray(scope.model)){
                    scope.values = Utils.arrayToList(scope.model);
                }
               
                for(var i in scope.items){
                    if(scope.items[i] === '*' || scope.items[i] === 'authenticated'){
                        continue;
                    }
                    scope.displayItems.push(scope.items[i]);
                }
                
                // sterilize the string in field
                var sync = function(){
                    var diferred = $q.defer();                    
                    diferred.resolve(scope.values);
                    return diferred.promise;
                };
                                             
                scope.callback = function(){ 
                    if(angular.isDefined(scope.values)){
                        scope.model   = Utils.listToArray(scope.values);
                    }
                    if(angular.isDefined(scope.changed)){
                        scope.changed({row:scope.data});
                    }
                };
                     
                scope.addNewRole = function(index,i){
 
                    if(angular.isUndefined(scope.values) ||
                        scope.model <= 0 ){
                        scope.values = i;
                    }else{
                        scope.values = scope.values + ',' + i;
                    }
                    scope.callback();

                };
                
            }
        };   
    }]);
   
   
