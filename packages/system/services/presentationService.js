/*
* Internal service to manage interface persistance and pagination
* across multiple objects.
* 
* BECAUSE IM BAD AT MATH ...................................
So if total rows represents an item, let's say you have
N total items to display, and you have M items per page then:

total pages required = Ceiling(N/M) but make sure you don't use integer math
The start Index for a given page, P, assuming you start at index 0 is:
startIndex = (P - 1) * M
and the end index is just
endIndex = startIndex + M - 1

For your example, given N total rows and M = 24 items per page, you would have:
Total Pages = Ceiling (N/24)

New isntance params 
this.persist:  will make use of the Persistence tool to retain state
this.id: Is required to find the object.

PresentationService is a pure angluar service although it utilizes some "factory" like functionality 
these new object instances are local. and the service only maintains a list of objects related to
modules in the system. it hides the interface logic bullshit that always creates 
mad clutter.
*/

angular.module('system')

.service('PresentationService',['Persistence','ServiceUtils',function(Persistence,ServiceUtils){
    
        var presentationService = function(params){ 
            //warning do not set these values directly .. use
            //accessor methods.
            this.persist      = params.persist || false; // store this presentation Object
            this.report       = params.report  || false; // use console reporting.
            this.id           = params.id      || false; // unique id of object
            this.count        = params.count   || {};    // mumber of pages
            this.start        = params.start   || 0;     // start page
            this.limit        = params.limit   || 3;     // limit per page
            this.custom       = params.custom  || {};    // custom set parameters
            this.range        = params.range   || [];    // 
            this.page = (params.page === 0)? 1 : 1 || 1; // always page 1 when set to 0
            this.update();
        };
        
        presentationService.prototype.update = function(){
       
            this.lastIndex   = Math.ceil((this.count.total + this.limit) / this.limit);
            this.lastpage    = Math.ceil(this.count.total / this.limit);

            if((!this.page) || (this.page < 1)){  
                this.page  =  this.lastpage;
            }else if(this.page  > this.lastpage){
                this.page  = 1;
            }
            // needs to be set after the update in this current config.
            this.start = (this.page-1) * this.limit;
            this.end   = this.start + this.limit -1;  
           
            if(this.persist && Persistence.isActive){
                Persistence.saveState(this.id,this);
            }
        };
        
        presentationService.prototype.changePage = function(page){
            this.page = page;
            this.update();
        };
        
        presentationService.prototype.nextPage = function(){
            this.page++;
            this.update();
        };
        
        presentationService.prototype.lastPage = function(){
            this.page--;
            this.update();
        };
        
        this.name      = 'PresentationService: ';
        this.report    = false; // Report operations to console log.
        this.objects   = [];    // Array of objects for framework modules.
        
        this.flushInstance = function(id){
            delete this.objects[id];
        };
        
        this.flushPersistence = function(id){
            Persistence.removeState(id);
        };
        
        this.getParam = function(id,key){
            if(this.objects[id]){
                return this.objects[id].custom[key];
            }
        };
        
        this.setParam = function(id,key,val){
            if(this.objects[id]){
                this.objects[id].custom[key] = val;
            }
        };
        
        this.hasInstance = function(id){
            return (this.objects[id])? true : false;
        };
        
        this.hardResetInstance = function(params){
            if(this.objects[params.id]){
                this.objects[params.id] = new presentationService(params);
            }
        };
        
        this.getInstance = function(id){
            return this.objects[id];
        };
        
        this.newInstance = function(params){
            var auto    = params.auto || false;
            this.report = (params.report)? true : false;
            if(Persistence.isActive && Persistence.isValid(params.id) && params.persist){
                params = Persistence.getState(params.id);
            } 
            if(this.objects[params.id] && auto){
                // returns the cached instance ... soft reset.
                return this.objects[params.id];
            }
            // returns a comple new instance   ... hard reset.
            this.objects[params.id] = new presentationService(params);
            return this.objects[params.id];
        };
}]);