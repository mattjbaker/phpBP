/* 
 * Created by Matt Baker 2015
 */
'use strict';

angular.module('admin')
        .service('AdminMessenger',['MSG','MessageService',
        function(MSG,MessageService){
                
            var adminMessenger = {};
            
            adminMessenger.success = function(res){
                MessageService.addMessage([MSG.KEYS.articlesMsg],res,
                MSG.CLASS.alertSuccess);
            };
            
            adminMessenger.error = function(res){
                MessageService.addMessage([MSG.KEYS.articlesErr],res,
                MSG.CLASS.alertError);
            };
            
            return adminMessenger;
        }
    
]);