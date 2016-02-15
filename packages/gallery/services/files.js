/*
 * Files service
 */
angular.module('gallery')


.factory('FilesService',['FilesResource','Session','PresentationService',
    function(FilesResource,Session,PresentationService){
        
   
       
       var filesService = function(id){
           this.id = id;
           this.construct();
       };
       
       filesService.prototype.construct = function(){
           var pres = {report:false,auto:false,start:0,page:1,
                        id:this.id,limit:10,persist:false,
                        count:FilesResource.total.get({key:'user',val:Session.userId}),
                        custom:{sort:'created',order:'(d)',user:Session.userId}};
            this.args = PresentationService.newInstance(pres); 
       };
       
       // loads all user files.
       filesService.prototype.loadAllbyUser = function(){
           return FilesResource.keyval.query({key:'user',val:this.user});
       };
       
//       filesService.prototype.removeFile = function(){
//           
//       };
//       
//       filesService.prototype.removeFromGalery = function(){
//           
//       };
//       
//       filesService.prototype.addToGallery = function(){
//           
//       };
//       
//       // load a user gallery.
//       filesService.prototype.loadUserGallery = function(){
//           
//       };
       
        // loads first result.
        filesService.prototype.loadUserFiles = function(){
//            dump(this.args);
            return FilesResource.pages.query({key:'user',
                                           val:this.args.custom['user'],
                                         start:this.args.start,
                                           per:this.args.limit,
                                          sort:this.args.custom['sort'] + 
                                               this.args.custom['order']});
        };
      
        filesService.prototype.loadAll = function(){
           return FilesResource.main.query();
        };
       
       
       this.instances   = [];
       this.getInstance = function(id){
         if(!this.instances[id]){
            this.instances[id] = new filesService(id);
         } 
          return this.instances[id];
       };
       
       return this;

}]);