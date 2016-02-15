(function(window,angular,undefined){ 'use strict';

    angular.module('matts-carousel',[])
   .factory('mcAnims',['$timeout',mcAnimsFactory])
   .directive('mCarousel',['$compile', '$rootScope', mcarouselDirective])
   .directive('mcarouselUnit',[mcarouselUnitDirective])
   .directive('mcBtn',['$rootScope',mcBtnDirective])
   .directive('mcarouselTarget',['mcAnims',mcarouselTargetDirective])
   .directive('mSlider',[mSliderDirective])

   .run(['$templateCache',
    function($templateCache){
        $templateCache.put('template/mcarousel/carousel.html',
       '<div class="matts-carousel-container" mcarousel-target>'+
       '<div class="matts-carousel-headder">{{title}}</div>'+
       '<div class="matts-carousel-button mc-last-btn" mc-btn>'+
       '<i class="fa fa-chevron-circle-left"></i></div>'+
       '<div class="matts-carousel-button mc-next-btn" mc-btn>'+
       '<i class="fa fa-chevron-circle-right"></i></div>'+
       '<div class="matts-carousel-row" mcarousel-row>'+
       '<div class="matts-carousel-slide" mcarousel-slide>'+
       '<div class="matts-carousel-unit" ng-repeat="item in items" mcarousel-unit>'+
       '<img width="100px" src="{{item.path}}"></a></div>'+
       '</div></div><div class="matts-carousel-cursor" mcarousel-cursor>'+     
       '<table><tr><td ng-repeat="page in pages"></td></tr></table></div></div>'); 
    }]);
   
    function mcAnimsFactory($timeout){
        return{
            isAnimated: function(elem){
                return ($(elem).hasClass('anim'))? true : false;
            },
            fader: function(elem,speed,op){
                if(!this.isAnimated(elem)){
                    $(elem).show().stop().dequeue().fadeTo(speed,op);
                }else{
                     $(elem).addClass('anim').fadeTo(speed,op,function(){
                        $(elem).removeClass('anim').hide().dequeue();
                    });
                }
            }
        };
    }
   
    // DIRECTIVES ...............................................
    function mcarouselDirective($compile,$rootScope){      
            return{
                templateUrl: function(elem, attrs) {
                    return attrs.templateUrl || 'template/mcarousel/carousel.html';
                },
                controller : "@",
                name:"controllerName",
                link: linker_fn
            }; 
            function linker_fn(scope,elem,attrs){
               
                scope.c = {};
                var top    = $(elem).children('div');
                var row    = top.children('.matts-carousel-row');
                var slide  = row.find('.matts-carousel-slide');

                scope.c.object_id = scope.c.object_id || JSON.stringify(scope.$id);
                       
                function  init() {
                    scope.c.slots = Math.floor(scope.c.visible_width / scope.c.unit_width);
                    if (scope.c.slots <= scope.c.total) {
                        scope.c.buttons = false;
                    }
                    scope.c.slide_width = scope.c.unit_width * scope.c.slots;
                };    
                
                function construct(){ 
                    scope.c.unit_width    = scope.unit_width;
                    scope.c.visible_width = row.width();
                    init();
                    scope.c.pages = scope.tp;
                    slide.width(scope.c.slide_width);
                    scope.setLimit(scope.c.slots);
                    scope.loadItems();        
                    console.log(scope.c);
                }
                
                $(window).resize(function(){
                   construct();
                });
                
               construct();
           }
    }
   
    function mcarouselUnitDirective($rootScope){
        return{
            link:linker_fn
        };
        
        function linker_fn(scope,elem,attrs){
          
            elem.bind('click',function(){
            alert('clicked on unit');
            });
        }
    }

    function mcBtnDirective($rootScope){
        return{
            link:linker_fn
        };
        function linker_fn(scope,elem,attrs){
             var top    = $(elem).parent();
             var main   = top.children('.matts-carousel-row');
             var slide  = main.find('.matts-carousel-slide');
             
             var next = top.children('.mc-next-btn');
             var last = top.children('.mc-last-btn');

           elem.bind('click',function(){
                 
                slide.animate({width: 0},function(){ 
                   scope.loadItems();
                   slide.animate({width: scope.c.slide_width},function(){});
                });
            });
        }
    }

    function mcarouselTargetDirective(mcAnims){
        return{
            restrict: 'A',
            link: linker_fn
        };
        
        function linker_fn(scope,element,atrrs){
     
             var btns   = $(element).children('.matts-carousel-button');
             var cursor = $(element).children('.matts-carousel-cursor');
          
            scope.$on('scrolled', function(event,msg) {
                if(msg === scope.c.object_id){
                    mcAnims.fader(btns,'fast',0.4,350);
                    mcAnims.fader(cursor,'fast',0.4,350);
                }
            });
            $(element).hover(function(){
                if(scope.c.pages === 1){return;}
                mcAnims.fader(btns,'fast',0.4,350);
                mcAnims.fader(cursor,'fast',0.4,350);

           },function(){
                mcAnims.fader(btns,'fast',0,350);
                mcAnims.fader(cursor,'fast',0,350);
            });           
        }
    }

    function mSliderDirective(){
        return{
            templateUrl: function(elem,attrs){
                return attrs.templateUrl || '<div>No Template</div>';
            },
            controller : '@',
            name: 'controllerName',
            link: linker_fn
        };
        
        function linker_fn(scope,elem,attrs){

            scope.loadItems();  

            var duration   = 5000;
            var index      = 0;
            var mcs        = $(elem).children().find('.mcs-gallery');
            var next       = $(elem).children().find('.mc-slider-next');
            var images     = $(elem).children('.mcb-gallery img');
            var thumbnails = $(elem).children('.mcs-gallery img');
            var imgHeight  = $(thumbnails).attr("height");

            $(thumbnails).slice(0,3).clone().appendTo(mcs);

            next.click(sift);
            show(index);
            setInterval(sift, duration);

            function sift(){
                 index = scope.selected;
                    if (scope.selected < (scope.items.length-1)){scope.selected+=1 ; }
                    else {scope.selected=0;}
                   return show(scope.selected);
            }

            function show(num){ 
                // this function is used to show relevant images onclick of the arrow mark{
                    images.fadeOut(400);
                    $(".image-"+num).stop().fadeIn(400);
                    var scrollPos = (num+1)*imgHeight;
                    mcs.stop().animate({scrollTop: scrollPos}, 400);		
                    if(!window.console){ window.console = {log:function(){}}; }
                    else{ console.log(scrollPos, "thumb.image-"+num); }
            }
        }   
    }
    
})(window, window.angular);
