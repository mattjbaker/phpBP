/* 
 * class to create or set standard angularjs resources.
 */
angular.module('system')

.factory('ResourceService',['$resource',
    function($resource){
 
    // some of these prepared statements are redundant
    // dynamic angular resource objects 
    var resourceObj = function(name){
       this.dirty   = false;
       this.total   = $resource('api/'+name+'/:key/:val/ct',{key:'@key',val:'@val'},{get:{method:'GET'}});
       this.count   = $resource('api/'+name+'/count',{},{query:{method:'GET'}});
       this.parts   = $resource('api/'+name+'/sort/:sort/limit/:per/start/:start',
                       {sort:'@_sort',limit:'@_per',start:'@_start'},{});
       this.byval   = $resource('api/'+name+'/:val/:id',{val:'@_val',id:'@_id'},{get:{method:'GET'},update:{method:'PUT'},remove:{mtehod:'DELETE'},exists:{method:'GET'}});
       this.verb    = $resource('api/'+name+'/:verb/:key/:val',{verb:'@_verb',key:'@_key',val:'@_val'},{});
       this.keyval  = $resource('api/'+name+'/:key/:val',{key:'@_key',val:'@_val'},{});
       this.main    = $resource('api/'+name+'/:id',{id:'@_id'},{update:{ method:'PUT'},create:{method:'POST'},get:{method: 'GET',isArray: true},remove:{method: 'DELETE'}});
       this.pages   = $resource('api/'+name+'/:key/:val/sort/:sort/limit/:per/start/:start',
                      {key:'@_key',val:'@_val',start:'@_start',per:'@_per',sort:'@_sort'},{getpage:{method: 'GET',isArray:true}});
    };    
        
    var resourceService         = {};
        resourceService.flush   = [];
        resourceService.sources = [];
        
    var isValid = function(name,method){
        if(method){
            return (resourceService.sources[name][method])? true : false;
        }
        return (resourceService.sources[name])? true : false;
    };
    
    // Adds a resource to flush array.
    resourceService.markDirty = function(name){
        resourceService.flush[name] = true;
    };
    
    // Removes a list from the flush array
    resourceService.markClean = function(name){
        resourceService.flush[name] = false;
    };

    resourceService.isDirty = function(name){
        if(isValid(name)){
            return resourceService.sources[name].dirty;
        }
        return false;
    };

    resourceService.clearCache = function(){
        resourceService.sources.flush = [];
    };

    resourceService.flushResources = function(){
        resourceService.sources = [];
        console.log('Resource services flushed');
    };
    
    resourceService.flushResource = function(name){
        if(isValid(name)){          
            resourceService.sources.splice(name,1);
            console.log('Resource ('+name+') flushed');
        }
    };
    
    resourceService.addCustomResource = function(name,params){
        resourceService.sources[name] = 
        $resource(params.url,params.args,params.methods);
        console.log('Custom ('+name+') resource added');
    };
    
    resourceService.addSubResource = function(name,method,params){
        resourceService.sources[name][method] = 
        $resource(params.url,params.args,params.methods);
        console.log(name+' ('+ method+') custom sub resource added');
    };
    
    resourceService.createResource = function(name){
        resourceService.sources[name] = new resourceObj(name);
        console.log('Resource ('+name+') created');
    };

    resourceService.getResource    = function(name,auto){
        // if auto = false the object must be instantiated manually via "createResource(name)".
        if(resourceService.flush[name] && isValid(name)){
            resourceService.flushResource(name);
            resourceService.flush[name] = false;
        }
        if(!isValid(name) && auto ){
            resourceService.createResource(name);
        }
        return resourceService.sources[name];
    };
    
    return resourceService;

}]);