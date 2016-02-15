'use strict';

// Requirements for admin package include the system core packages and services
// and the users packages and services. 
// systemMessage MSG usersService api interface and systemService api 
// interface
ApplicationConfiguration.registerModule('admin',['smart-table']);
angular.module('admin')
 .run(['CONST','Menus',
    function(CONST,Menus){  
        
        CONST.MSG.KEYS.settingsErr     = 'admin-settings-error';
        CONST.MSG.KEYS.settingsSuccess = 'admin-settings-success';
      
        Menus.addMenuItem({id: 'topbar', title: 'Admin Menu', URL: 'admin', type: 'dropdown',
            UIRoute: 'admin', isPublic:false, roles: ['admin'], position: 1});

        Menus.addSubMenuItem({id: 'topbar',
            root: 'admin', title: 'Site Settings',
            URL: 'admin/settings', UIRoute: 'admin.settings',
            isPublic: false, roles: ['admin'],
            position: 1});

        Menus.addSubMenuItem({id: 'topbar',
            root: 'admin', title: 'User Accounts', URL: 'admin/accounts',
            roles: ['admin'], isPublic: false, position:2,      
            UIRoute: 'admin.accounts'});
        
        Menus.addSubMenuItem({id: 'topbar',
            root: 'admin', title: 'divider', URL: null,
            roles: ['admin'], isPublic: false, position:3, 
            UIRoute: 'admin', method: 'console' });
        
        Menus.addSubMenuItem({id: 'topbar',
            root: 'admin', title: 'divider', URL: null,
            roles: ['admin'], isPublic: false, position:99, 
            UIRoute: 'admin', method: 'console' });
        
        Menus.addSubMenuItem({id: 'topbar',
            root: 'admin', title: 'Console', URL: null,
            roles: ['admin'], isPublic: false, position:100, 
            UIRoute: 'admin', method: 'console' });
    }
]);
