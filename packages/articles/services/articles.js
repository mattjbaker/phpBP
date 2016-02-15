/* 
* Articles service to manage async loading of articles 
* */

angular.module('articles')


.factory('ArticlesService',['ArticlesResource','PresentationService','Persistence','WatcherService',
    function(ArticlesResource,PresentationService,Persistence,WatcherService){
        
        
        
        var articlesService = function(){  
            this.articles = {};
            this.reset();
        };

       articlesService.prototype.reset = function(){
            var pres  = {persist:false,id:'articles',start:0,limit:5,page:1,count:ArticlesResource.count.query(),
                        custom:{sort:'created',order:'(d)'}};
            this.args = PresentationService.newInstance(pres);
         
       };
        

        articlesService.prototype.loadArticles = function(){  
         
            if(WatcherService.isDirty('articlesWatcher','articles')){
               
                this.reset();
                WatcherService.markClean('articlesWatcher','articles');
            }
            this.articles  = ArticlesResource.parts.query({
                    start:this.args.start,
                      per:this.args.limit,
                     sort:this.args.custom['sort'] + this.args.custom['order']
            });
            // always run this after articles reloads! or you will loose pagination.
            this.args.update();
        };

        articlesService.prototype.getArticle = function(params){
            this.articles = ArticlesResource.main.get({},params);
        };
       
       // This will fragment the comments.
        articlesService.prototype.removeArticle = function(article){
            ArticlesResource.main.remove({id:article})
            .$promise.then(function(res){
                WatcherService.setValue('commentsWatcher','removed',article);
            },function(er){});
            this.reset();
             
        };

        articlesService.prototype.updateArticle = function(article){
            ArticlesResource.main.update(article._id,article)
            .$promise.then(function(){

               return false;
            });
        };
            
    return new articlesService();
}]);