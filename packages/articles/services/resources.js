/* 
 * Created by Matt Baker 2015
 * articles api resources.
 */
'use strict';

angular.module('articles')
.factory('ArticlesResource',['ResourceService',
     function(ResourceService){       
     return ResourceService.getResource('articles',true);
}]);

