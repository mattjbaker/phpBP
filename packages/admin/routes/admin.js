'use strict';

// inherited child routes allow for packages to be 
// loaded upon state. and authentication to be inherited
angular.module('admin')
.config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
        .state('admin', {
            url: '/admin',
            templateUrl: 'packages/admin/view/admin.html',
            abstract:true,
            data: {
                roles: ['admin']
            }
        })
        .state('admin.accounts', {
            url: '/accounts',
            templateUrl: 'packages/admin/view/admin-accounts.html'
        })
        .state('admin.settings', {
            url: '/settings',
            templateUrl: 'packages/admin/view/admin-settings.html'
        })
        .state('admin.backups',{
             url: '/backups',
             templateUrl: 'packages/admin/view/admin-backups.html'
        });
    }
]);
