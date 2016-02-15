/* 
 * Created by Matt Baker 2015
 */
'use strict';

angular.module('users')
.service('AuthMessenger',['MSG','MessageService',
    function(MSG,MessageService){

    var authMessenger = {};

    authMessenger.success = function(res){
        MessageService.addMessage([
        MSG.KEYS.authMsg],res,
        MSG.CLASS.alertSuccess);
    };

    authMessenger.error = function(res){
        MessageService.addMessage([
        MSG.KEYS.authErr],res,
        MSG.CLASS.alertError);
    };

    return authMessenger;
    }
])

.service('UsersMessenger',['MSG','MessageService',
    function(MSG,MessageService){
                
    var usersMessenger = {};

    usersMessenger.success = function(res){
        MessageService.addMessage([MSG.KEYS.userMsg],res,
        MSG.CLASS.alertSuccess);
    };

    usersMessenger.error = function(res){
        MessageService.addMessage([MSG.KEYS.userErr],res,
        MSG.CLASS.alertError);
    };

    return usersMessenger;
    }
    
]);
