/* 
 * Created by Matt Baker 2015
 */

angular.module('system')
    .service('Templates',['$q','$templateCache','$http',
    function($q,$templateCache,$http){
        
        var templates       = [];
        var systemTemplates = {};
        
        systemTemplates.add=function(temp){ 
            templates.push(temp);
            return systemTemplates;
        };
        
        systemTemplates.compile=function(){
            for(var t in templates){
                $templateCache.put(templates[t].name,
                $http.get(templates[t].url));
            }
        };
        
        return systemTemplates;
            
}]);
