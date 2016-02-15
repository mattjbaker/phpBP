'use strict';

angular.module('admin')
        .controller('AdminAccountsMessageController',['$scope','MSG',
        'MessageService',
        function($scope,MSG,MessageService){
            MessageService.init($scope,false);
            MessageService.getMessages($scope,[MSG.KEYS.userError,
            MSG.KEYS.authErr,MSG.KEYS.authMsg,MSG.KEYS.userMsg]);
        }
]);

angular.module('admin')
        .controller('AdminSettingsMessageController',['$scope','MSG',
        'MessageService',
        function($scope,MSG,MessageService){
            MessageService.init($scope,false);
            MessageService.getMessages($scope,[MSG.KEYS.settingsError]);
        }
]);