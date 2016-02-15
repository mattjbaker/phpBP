/* 
 * Created by Matt Baker 2015
 * share values from comment directives to comment 
 * view controllers.
 */
'use strict';
angular.module('comments')
 
 // comments mapper service houses data persistent across all comment instances after load.
.service('CommentsMapper',
    function(){
    this.children  = [];
    this.collapsed = [];
    this.deleted   = []; 
})

.factory('CommentsService',['CommentsResource','CommentsMapper','PresentationService','WatcherService',
    function(CommentsResource,CommentsMapper,PresentationService,WatcherService){
        // recrusive delete method .. requires underscore js 'contains' method
        // or a similar fucntion.
        
        var queDeleted = function(c){
            if(!_.contains(CommentsMapper.deleted,c)){
                CommentsMapper.deleted.push(c);
                CommentsResource.main.remove({id:c}).$promise.then(function(res){
                   console.log(c + ' removed!!'); 
                });
             }
            if(CommentsMapper.children[c]){
                CommentsResource.keyval.query({key:'parent',val:c})
                .$promise.then(function(res){
                    angular.forEach(res, function(v,k){
                        queDeleted(v._id);
                    });
                },function(er){});
            }
        };        
       
        var commentsService = function(parent){     
            // Process to sielently remove all values of deleted parents
            if(WatcherService.getValue('commentsWatcher','removed').length > 0){
                var c = WatcherService.getValue('commentsWatcher','removed');
                queDeleted(c);
                WatcherService.setValue('commentsWatcher','removed',[]);
            }     
            this.parent = parent;
            this.reset();
        };
        
        commentsService.prototype.reset = function(){  
            var pres  = {persist:false,id:this.parent,start:0,limit:this.limit,page:1,auto:false,
                        count:CommentsResource.total.get({key:'parent',val:this.parent}),
                        custom:{sort:'created',order:'(d)',
                        collapsed:false }};
            this.args = PresentationService.getInstance(this.parent) || PresentationService.newInstance(pres);
            this.args.update();
        };
        
        commentsService.prototype.loadComments = function(){ 
                CommentsMapper.children[this.parent]  = this.args.count;
                return  CommentsResource.pages.query({key:'parent',
                                              val:this.parent,
                                              start:this.args.start,
                                              per:this.args.limit,
                                              sort:this.args.custom['sort']
                                              + this.args.custom['order']
                                              });
        };
                
        // removes top item from model and children to delete.    
        commentsService.prototype.removeComment = function(c){
            queDeleted(c);
            for(var i in this.comments){
                if(this.comments[i]._id === c){
                    this.comments.splice(i,1);
                }
            }
            CommentsMapper.deleted = [];
            this.args.page = 1;
            this.args.update();
        };
                       
        commentsService.prototype.changeLimit = function(val){
              this.args.limit = val; 
              this.args.update();
        };
        
        commentsService.prototype.nextPage = function(){
            this.args.page++;
            this.args.update();
        };
        
        commentsService.prototype.lastPage = function(){
            this.args.page--;
            this.args.update();
        };
        
        return commentsService;
   }]);
