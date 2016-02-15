/* 
 * Created by Matt Baker 2015
 */
angular.module('articles')
.controller('ArticlesMessageController', ['$scope', 'MSG', 'MessageService',
    function ($scope, MSG, MessageService) {
        MessageService.init($scope, false);
        MessageService.getMessages($scope, [MSG.KEYS.articlesError]);
    }
]);
