/* 
 * Created by Matt Baker 2015
 *
 */
'use strict';

angular.module('articles')
        .service('ArticlesMessenger',['MSG','MessageService',
        function(MSG,MessageService){
                
            var articlesMessenger = {};
            
            articlesMessenger.success = function(res){
                MessageService.addMessage([MSG.KEYS.articlesMsg],res,
                MSG.CLASS.alertSuccess);
            };
            
            articlesMessenger.error = function(res){
                MessageService.addMessage([MSG.KEYS.articlesErr],res,
                MSG.CLASS.alertError);
            };
            
            articlesMessenger.confirm = function(msg){
                
            };
            
            return articlesMessenger;
        }
    
]);