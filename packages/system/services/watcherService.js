/* 
* A global watcher interface service to track events on 
* data accessible across multiple "Persistant" routes and thier objets.
* requires the _contains method from underscore js.
* 
*/
angular.module('system')
.service('WatcherService',['ServiceUtils',
function(ServiceUtils){
    
    var watcherObject = function(key,params){
        this.id     = key           || 'unknown';
        this.name   = 'Watcher: '+ key;
        this.report = params.report || false;
        this.dirty  = params.dirty  || [];
        this.custom = params.custom || {}; 
    };
    
    watcherObject.prototype.getDirty = function(value){
        ServiceUtils.report(this.report,'checking '+value,this.name);
        return (_.contains(this.dirty,value))? true : false;
    };
    
    watcherObject.prototype.setCustom = function(key,value){
        ServiceUtils.report(this.report,'adding Custom value',this.name);
        this.custom[key] = value;
    };
    
    watcherObject.prototype.getCustom = function(key){
        ServiceUtils.report(this.report,'Returning Custom value',this.name);
        return this.custom[key];
    };
    
    watcherObject.prototype.setDirty = function(values){
         for(var i in values){
           if(this.dirty.indexOf(values[i]) <= -1){
               ServiceUtils.report(this.report, values[i] + ' object marked as dirty!',this.name);
               this.dirty.push(values[i]);
           }
       }
    };
    
    watcherObject.prototype.setClean = function(value){
        ServiceUtils.report(this.report,value+' reset as clean',this.name);
        this.dirty.splice(value,1);
    };
    
    this.name     = 'WatcherService:';
    this.report   = true;
    this.watchers = [];
    
    this.flushWatcher = function(key){
        ServiceUtils.report(this.report,key+' flushed!',this.name);
        return delete this.watchers[key];
    };
    
    this.flush = function(){
        ServiceUtils.report(this.report,'objects flushed!',this.name);
        return this.watchers = [];
    };
    
    this.isDirty = function(key,val){
        return this.watchers[key].getDirty(val);
    };
    
    this.getValue = function(key,val){
        return this.watchers[key].getCustom(val);
    };
    
    this.setValue = function(key,id,val){
        return this.watchers[key].setCustom(id,val);
    };
    
    this.markDirty = function(key,values){
        if(!this.watchers[key]){
           return this.watchers[key] = new watcherObject(key,values);
        }
        return this.watchers[key].setDirty(values);
    };
    
    this.markClean = function(key,val){
        return this.watchers[key].setClean(val);
    };

    this.newInstance = function(key,args){
        return this.watchers[key] = new watcherObject(args);
    };
    
    this.createWatcher = function(id,args){
       ServiceUtils.report(this.report,id +' created',this.name);
       return this.watchers[id] = new watcherObject(id,args);
    };
    
    this.getInstance = function(key){
        if(!this.watchers[key]){ 
          ServiceUtils.report(this.report,key+' does not exist',this.name);
        }
        return this.watchers[key];
    };
    
    this.getWatcher = function(val){
        return this.getInstance(val);
    };
}]);
