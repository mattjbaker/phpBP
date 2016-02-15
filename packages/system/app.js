'use strict';

// template configs and custom rootscope events are located
// in the routes/system.js file for this module.

ApplicationConfiguration.registerModule('system',[]);

angular.module('system')

.constant('CONST',{
   USER_ROLES: {
        all:    '*',
        auth:   'authenticated',
        admin:  'admin',
        editor: 'editor',
        guest:  'guest'
    },
    AUTH_EVENTS: {
        userDeleted:      'auth-user-deleted',
        userCreated:      'auth-user-created',
        userPendingReset: 'auth-user-forgot',
        isAutorized:      'auth-user-authorized',
        loginSuccess:     'auth-login-success',
        loginFailed:      'auth-login-failed',
        logoutSuccess:    'auth-logout-success',
        sessionTimeout:   'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized:    'auth-not-authorized',
        sessionRevoked:   'auth-session-revoked'
        
    },
    MSG:{
        CLASS:{
            alertError:   'alert-danger',
            alertSuccess: 'alert-success',
            alertWarning: 'alert-warning',
            alertLink:    'alert-link',
            modalMsg:     'modal-message'
        },
        KEYS:{
           globalMsg:   'system-msg',
           defaultMsg:  'system-default',
           globalErr:   'system-error',
           globalModal: 'system-modal'
        }
    }           
})
.factory('USER_ROLES',['CONST',function(CONST){
        return CONST.USER_ROLES;
    }
])
.factory('MSG',['CONST',function(CONST){
        return CONST.MSG;     
    }
])
.factory('AUTH_EVENTS',['CONST',function(CONST){
        return CONST.AUTH_EVENTS;
    }
]);
