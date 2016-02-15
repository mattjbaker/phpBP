/* 
 * for the headlines directive.c
 */
'use strict';
angular.module('articles')

 //little bit of classic jquery. 
.directive('mcaroselTarget',['$timeout',function($timeout){
    return{
      restrict: 'A',
      link:function(scope,element,attrs){
         var time   = 350;
         var btns   = $(element).children('.matts-carosel-btn');  
         var slider = $('.slide-cursor');
         var timer;
         $(element).hover(function(){
             timer = $timeout(function(){
             if(!btns.hasClass('anim') && !slider.hasClass('anim')){
                 slider.stop().dequeue().fadeTo('fast',0.4);
                 btns.show().stop().dequeue().fadeTo('fast',0.4);
                } 
            },time);
         },function(){
            $timeout.cancel(timer);
          
              slider.addClass('amin').fadeTo('fast',0,function(){
                 slider.removeClass('anim').dequeue(); 
              });

              btns.addClass('anim').fadeTo('fast',0,function(){
                  btns.removeClass('anim').hide().dequeue();
              });
          
         });
      }    
    };            
}]);