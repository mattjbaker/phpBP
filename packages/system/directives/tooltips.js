'use strict';



angular.module('system')
        .directive('showTip',['$timeout',function($timeout){
        return {
            restrict: 'EA',
            link: function(scope,element,attrs){
                
            // My comprehensive tooltip directive..
            // im considering a variable to set the style as well.
            // worried about scope conflicts in multi directive elements
            
                if(window.jQuery){
                    
                
                    var shown  = false;
                    var timer;
               
                    $(element).hover(function(e){
                        
                        if(shown){return;}
                        clearTimeout(timer);
                        shown  = true;
                        
                         var title = $(this).attr('title');
                        $(this).data('tipText',title).removeAttr('title');
                        
                        $('<div class="tip tooltip"></div>' )
                                 .html('<div class="tooltip-arrow"></div>\n\
                                        <div class="tooltip-inner">'+title+'</div>').appendTo('body').fadeIn('fast');  
                               
   
                         timer = setTimeout(function () {
                               $('.tip').fadeOut('fast',function(){
                                   $(this).attr('title', $(this).data('tipText'));
                                   $('.tip').remove();
                           });
                        }, 2000);

                    },function(){
                        clearTimeout(timer);
                        $(this).attr('title', $(this).data('tipText'));
                        $('.tip').fadeOut('fast',function(){
                            $('.tip').remove();
                        });
                        shown = false;
                    }).mousemove(function(e){
                    
           
                        var mousex = e.pageX + 10; // GET X cords
                        var mousey = e.pageY + $(element).height() + 2; // GET Y cords

                        $('.tip').css({top: mousey, left: mousex});
                         
                    }).mousedown(function(){
                        shown=true;
                        $('.tip').remove();
                    }).blur(function(){
                        shown=true;
                        $('.tip').remove();
                    }).focus(function(){
                        shown=true;
                        $('.tip').remove();
                    });    
               
                }
                return;
            }
          
        };     
}]);