/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templaltes
 * and open the template in the editor.
 */
'use strict';
angular.module('system')
.factory('ServiceUtils',function(){
   return{
        isObject: function(object){
           return (angular.isDefined(object))? true : false;  
        },
        report: function(lock,msg,name){
            if(name){
                return (lock)? console.log(name+' '+msg) : false;
            }
           return (lock)? console.log(msg) : false;
        }
   }; 
});
