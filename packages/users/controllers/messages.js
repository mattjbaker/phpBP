'use strict';

// These controllers hande user messages within a particular scope.
// They are swapped in and out of the message directive.

angular.module('users')
.controller('UsersMessageController',['$scope','MSG','MessageService',
function($scope,MSG,MessageService){
    MessageService.init($scope,false);
    MessageService.getMessages($scope,[MSG.KEYS.userError,
    MSG.KEYS.userMsg,MSG.KEYS.loginErr,MSG.KEYS.loginMsg,
    MSG.KEYS.regErr,MSG.KEYS.regMsg,MSG.KEYS.resetErr,MSG.KEYS.resetMsg,
    MSG.KEYS.forgotErr,MSG.KEYS.forgotMsg]);
}
]);



angular.module('users')
        .controller('LoginMessageController',['$scope','MSG','MessageService',
        function($scope,MSG,MessageService){ 
          
            MessageService.init($scope,false);
//            MessageService.addMessage([MSG.KEYS.loginMsg],{message:'test'},MSG.CLASS.alertError);
            MessageService.getMessages($scope,[MSG.KEYS.loginMsg,MSG.KEYS.loginErr]);  
        }
]);


angular.module('users')
        .controller('RegisterMessageController',['$scope','MessageService','MSG',
        function($scope,MessageService,MSG){
       MessageService.init($scope,false);
       MessageService.getMessages([MSG.KEYS.regErr,MSG.KEYS.loginErr,MSG.KEYS.userMsg,MSG.KEYS.userErr]);
    }
]);
        
 angular.module('users')
        .controller('ForgotMessageController',['$scope','MSG','MessageService',
        function($scope,MSG,MessageService){
        MessageService.init($scope,false);
        MessageService.getMessages([MSG.KEYS.forgotErr]);
    }
]);       
        
 angular.module('users')
        .controller('ResetMessageController',['$scope','MSG','MessageService',
        function($scope,MSG,MessageService){
        MessageService.init($scope,false);
        MessageService.getMessages([MSG.KEYS.resetErr]);           
    }
]);        
        