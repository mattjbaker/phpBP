
ApplicationConfiguration.registerModule('docs');
angular.module('docs')
    .run(['CONST','Menus',
    function(CONST,Menus){
        // menu button for documentation.
        Menus.addMenuItem({id: 'topbar', title: 'Docs',URL:'docs/index', type: 'button',
            UIRoute: 'index', isPublic: true, position: 5});
    }
]);