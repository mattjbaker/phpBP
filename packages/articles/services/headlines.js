/*
 * The HeadlinesService object.
 */
angular.module('articles')

    
.factory('HeadlinesService',['ArticlesResource','WatcherService','PresentationService',
    function(ArticlesResource,WatcherService,PresentationService){
    
    
    var headlinesService = function(){
        this.limit = 3;
        this.headlines = {};
        this.reset();
    };
    
    headlinesService.prototype.reset = function(){
        var pres = {start: 0, limit:this.limit, page: 1, count: ArticlesResource.count.query(),
            custom: {sort: 'created', order: '(d)'}};
        this.args = PresentationService.newInstance(pres);
        WatcherService.markClean('articlesWatcher','headlines');
    };

    headlinesService.prototype.next = function(){
        this.args.page++;
        this.args.update();
    };
          
    // loads first result.
    headlinesService.prototype.loadHeadlines = function(){
      
        if(WatcherService.isDirty('articlesWatcher','headlines')){
          this.reset();
        }
        this.headlines =  ArticlesResource.parts.query({  
               start:this.args.start,
                 per:this.args.limit,
                sort:this.args.custom['sort']+this.args.custom['order']});
     
    };
  
    return new headlinesService();

}]);