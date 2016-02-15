'use strict';


angular.module('system')
        .service('Message',['MSG',
        function(MSG){
            
        /**
         * This is the messge object factory.
         */    
        var messageObj,createMessage;
        
           messageObj = ( function() {
               function messageObj(keys,m,c){
                this.keys    =  keys || [];
                this.message =  m.message || m.data.message;
                this.class   =  c|| MSG.CLASS.alertError;
           }
           return messageObj;
        })();           
               
          createMessage = function(keys,m,c){
              return new messageObj(keys,m,c);
          };
          
          return{
              create: createMessage
          };
    }
]);


// GLOBAL system message stack
angular.module('system')
        .factory('MessageStack',['Utils',
    function(Utils){
        
        var stack = [];
        
        return{
            addMessage: function(message){
               
               //shift out old messages.
               //filters.
               for(var i in stack){
                 //remove previous instance of duplicate message.
                 if(angular.equals(stack[i].message,message.message) &
                    Utils.compareArr(stack[i].keys,message.keys )){
                    stack.splice(i,1);
                 }
                }
                stack.push(message);
            },
            removeMessage: function(index){
                stack.splice(index,1);
            },
            getMessages: function(){
                return stack;
            },
            nextIndex: function(){
                return stack.length + 1;
            },
            clearAll: function(){              
                stack = [];
            },

            clear: function(keys){    
                for(var i in stack){
                 if(Utils.compareArr(stack[i].keys,keys)){
                     stack.splice(i,1);
                }
                }
               
            }
            
        };
    }
]);


angular.module('system')
        .factory('MessageService',['Utils','Message','MessageStack','MSG','$timeout',
        function(Utils,Message,MessageStack,MSG,$timeout){
            
            var service = {
           
            messages:{},

            // persist makes message scope persistant. 
            // only used by "global" controllers.
            init:function(scope,persist){    
            
                var _scope = service.id(scope);
                if(!persist){
                    MessageStack.clearAll();
                }
                service.initMessages(_scope);
                service.watchForMessage(scope,_scope);
     
            },
               
            initMessages: function(_scope){
                service.messages[_scope] = MessageStack.getMessages();
            },

            // listen for local messages to change.
            watchForMessage: function (scope,_scope) {  
            
                scope.$watch(function () {
                   return service.messages[_scope];
                }, function (m) {                 
                    if (!angular.isUndefined(m)){
                                             
                        scope.dismiss = function(index){
                            scope.messages.splice(index,1);
                        };
                        
                        scope.dismissAll = function(){
                            var i =0;
                            angular.forEach(scope.messages,function(m){
                                scope.messages.splice(i,1);
                                i++;
                            });
                        };
                          
                        scope.messages = m;
                    }else{
                        scope.messages = null;
                    }
                }, true);
            },
            

            // Add a message to the global message stack.
            addMessage: function(keys,message,c){
                
                if(angular.isUndefined(message)){
                  
                    message = {message: "Unknown Message"};
                }
                if(angular.isDefined(message.error)){
                    message.message = message.error;
                }

                MessageStack.addMessage(new Message.create(keys,message,c));
            },
            
                
            getMessages:function(scope,keys){
               
                var _scope = service.id(scope);
              
                for(var i in service.messages[_scope]){
                    if(!Utils.compareArr(service.messages[_scope][i].keys,keys)){
                        service.messages[_scope].splice(i,1);
                    }
                }
            },
            
            id:function(scope){
                return JSON.stringify(scope.$id);
            }
            
            };
            return service;
        }
    ]);
