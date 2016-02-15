/* 
* Created by Matt Baker 2015
* articles api resources.
*/
'use strict';

angular.module('gallery')

.factory('FilesResource', ['ResourceService', function (ResourceService) {
        ResourceService.createResource('files');
        return ResourceService.getResource('files');

}])

.factory('GalleryResource', ['$resource', 'ResourceService', function (ResourceService) {
        ResourceService.createResource('gallery');
        return ResourceService.getResource('gallery');
}]);

