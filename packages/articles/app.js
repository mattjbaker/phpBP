'use strict';
ApplicationConfiguration.registerModule('articles');

angular.module('articles')
        .run(['CONST','Menus','Templates','WatcherService',
    function(CONST,Menus,Templates,WatcherService){
        
       WatcherService.createWatcher('articlesWatcher',{report:true,dirty:['articles','headlines'],ustom:[]});
      
       Templates.add({name:'articles-headline',url:'packages/articles/view/partials/articles-Headline.html'});
        // Create the admin menu entry.
        Menus.addSubMenuItem({id:'topbar',title:'Manage Articles',
            root:'admin',
            URL: 'articles/manage', isPublic:false, roles:['admin'],position:4,
            UIRoute:'articles.manage'});

        Menus.addMenuItem({id: 'topbar', title: 'News',
            URL:'articles', type: 'dropdown',
            UIRoute: 'articles', isPublic: true,position: 2});

        Menus.addSubMenuItem({id: 'topbar',
            root: 'articles', title: 'Create Article', URL: 'articles/create',
            isPublic: false, roles:['guest','admin','user'], position:1,          
            UIRoute: 'articles.create'});
        
        Menus.addSubMenuItem({id: 'topbar',
            root: 'articles', title: 'View Articles', URL: 'articles/view',
            isPublic: true, position:1,          
            UIRoute: 'articles.view'});
        
        CONST.MSG.KEYS.articlesMsg = 'articles-msg';
        CONST.MSG.KEYS.articlesErr = 'articles-error';   
                
}]);