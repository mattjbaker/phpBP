'use strict';

angular.module('admin')
        .directive('systemConsole',
        function(){
        return {
            restrict:    'E',
            templateUrl: 'packages/admin/view/partials/console.html'
        };  
    }            
    )

.directive('consoleInput',['$rootScope','consoleCommands',
    function($rootScope,consoleCommands){
    return{


        restrict: 'EA',
        link: function(scope, element, attr){
            
            var cmd    = null;
            var args   = [];
          
            var output_buffer = [];
            var input_hist    = [];
            var carrot = input_hist.length;
            
            $rootScope.$watch('console',function(){
               
               if( !$rootScope.console){
                   
                  $('#console_container').css('visibility','hidden');  
                }
                $('#console_container').css('visibility','visible');  
            });
    
    
          var update = function(){
               var i = output_buffer.length;
               var b = (i-1 <= 0)? '' : "<br>"; 
               $('#output').append(b + output_buffer[i-1]);
               $('#input').html("");
            };
            
          var execute = function(){
              
            if(cmd === 'object'){            
               $('#output').html("");
                output_buffer.push(consoleCommands.object(args)); 
            }else if (cmd === 'package'){
                var response;
                consoleCommands.package(args).then(function(ret){
                   output_buffer.push(ret);
                });
            
               // output_buffer.push(consoleCommands.package(args));
          
           }else if (cmd === 'api'){
               output_buffer.push(consoleCommands.apis(args));
            }else if(cmd === 'set'){
                output_buffer.push(consoleCommands.set());
            }else if(cmd === 'help'){
                output_buffer.push(consoleCommands.help(args));
            }else if (cmd === 'user'){
                output_buffer.push(consoleCommands.user(args));
            }else if( cmd === 'stat'){
                output_buffer.push(consoleCommands.stat(args));
            }else if( cmd === 'exit'){
               $rootScope.console = false;
               $('#console_container').css('visibility','hidden');
            }else if ( cmd === 'clear'){ 
               output_buffer = [];
               $('#input').html("");
               $('#output').html("");
               return;
            }else {
                output_buffer.push(consoleCommands.unknown(cmd));
            }
            return update();
          };
          
            $('#input').keydown(function(event){
                var index = input_hist.length;
                if(index > 0){
                   if(event.which === 40){ // down
                      
                       carrot = carrot - 1;
                       if(carrot < 0){
                           carrot = input_hist.length;
                       }
                       $('#input').html("");
                       $('#input').html(input_hist[carrot]);
                    }
                    if(event.which === 38){ // up
                     
                        carrot = carrot + 1;
                        if(carrot > input_hist.length){
                            carrot = 0;
                        }
                        $('#input').html("");
                        $('#input').html(input_hist[carrot]);
                    }
                }
                
            });
            
            $('#input').keypress(function(event){
        
                if (event.which === 13) {
                    scope.$apply(function(){
                        event.preventDefault();
                    });
                    var input = $('#input').html();
                   
                    args = input.split(" ");
                    cmd  = args[0].toLowerCase();
                    input_hist.push(args);
                    execute();
                }
            });
            
            element.bind('click',function(){
                $('#input').focus();
            });
            
            cmd = 'set';
            execute();
            
            element.on('destroy',function(){
                element.unbind('click');
            });

        }
    };
}]);