/* 
 * Directives for the user gallery and features realated to user files.
 */
'use strict';

angular.module('gallery')

.directive('fileUploader',function(){

})

.directive('imagePreview',function(){

})

.directive('galleryView',function(){
   return{
       templateUrl:'packages/gallery/view/partials/gallery-view.html'
   };
})

.directive('sliderView',function(){
    return{
        templateUrl: 'packages/gallery/view/partials/slider-view.html'
    };
})

.directive('fileView',function(){
    return{
        template: '<img src="{{path}}" width="{{width}}"></img>',
        link: function(scope,elem,attrs){            
        }
    };
});