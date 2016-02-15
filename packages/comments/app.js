/* 
 * Created by Matt Baker 2015 
 */

'use strict';
ApplicationConfiguration.registerModule('comments');

angular.module('comments')
.run(['CONST','Menus','Templates','WatcherService',
function(CONST,Menus,Templates,WatcherService){
    // Create the admin menu entry.
    WatcherService.createWatcher('commentsWatcher',{report:true,custom:{removed:[]}});
    
    Menus.addSubMenuItem({id:'topbar',title:'Manage Comments',
        root:'admin',
        URL: 'comments/manage', isPublic:false, roles:['admin'],position:5,
        UIRoute:'articles.manage'});

   Templates.add({name:'comments-form',url:'packages/comments/view/partials/comments-form.html'})
            .add({name:'comments-view',url:'packages/comments/view/partials/comments-view.html'})
            .add({name:'comments-cont',url:'packages/comments/view/partials/comments-container.html'});
    
}]);
