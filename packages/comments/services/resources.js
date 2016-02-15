/* 
 * Created by Matt Baker 2015
 */
'use strict';

angular.module('comments')
.factory('CommentsResource',['ResourceService',function(ResourceService){  
    ResourceService.createResource('comments');
    return ResourceService.getResource('comments');     
}]);

