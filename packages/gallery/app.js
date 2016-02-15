
'use strict';
ApplicationConfiguration.registerModule('gallery',['ngFileUpload']);

angular.module('gallery')
        .run(['CONST','Menus','Templates',
    function(CONST,Menus,Templates){
       
        Templates.add({name:'gallery-view',url:'packages/gallery/view/partials/gallery-view.html'});
        CONST.MSG.KEYS.articlesMsg = 'gallery-msg';
        CONST.MSG.KEYS.articlesErr = 'gallery-error';   
                
}]);