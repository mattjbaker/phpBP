'use strict';

ApplicationConfiguration.registerModule('users',['ngCookies','ngStorage']);

angular.module('users')
 .run(['CONST','Menus',
    function(CONST,Menus){
 
        Menus.addMenuItem({id: 'usermenu', title:'uanme', URL:'users', type: 'dropdown',
            UIRoute: 'users', isPublic: false, position: 99});
           
        Menus.addSubMenuItem({id: 'usermenu',
            root: 'users', title: 'Files', URL: 'gallery/manage',
            isPublic:false, position:1,          
            UIRoute: 'gallery.manage'});

        Menus.addSubMenuItem({id: 'usermenu',
            root: 'users', title: 'Settings', URL: 'users/account',
            isPublic: false, position:1,          
            UIRoute: 'users.account'});
        
        Menus.addSubMenuItem({id: 'usermenu',
            root: 'users', title: 'Logout', URL: 'home',
            isPublic: false, position:3,
            UIRoute: 'home'});


        CONST.MSG.KEYS.authMsg     = 'user-auth-msg';
        CONST.MSG.KEYS.authErr     = 'user-auth-error';
        CONST.MSG.KEYS.userErr     = 'user-error-msg';
        CONST.MSG.KEYS.userMsg     = 'user-success-msg';
        CONST.MSG.KEYS.loginErr    = 'user-login-error';
        CONST.MSG.KEYS.loginMsg    = 'user-login-message';
        CONST.MSG.KEYS.authMsg     = 'user-auth-message';
        CONST.MSG.KEYS.resetMsg    = 'user-reset-message';
        CONST.MSG.KEYS.regMsg      = 'user-register-message';
        CONST.MSG.KEYS.forgotMsg   = 'user-forgot-message';
        CONST.MSG.KEYS.sessionMsg  = 'user-session-message';
        CONST.MSG.KEYS.profilesErr = 'user-profiles-error';
        CONST.MSG.KEYS.profilesMsg = 'user-profiles-success';

    }
]);


