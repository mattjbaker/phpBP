'use strict';

angular.module('articles')

.controller('CarouselHeadlinesController',['$scope','HeadlinesService',
    function($scope,HeadlinesService){

       $scope.title = "HEADLINES";
       $scope.range = [];
       $scope.items = {};

       HeadlinesService.limit = 9;
       HeadlinesService.loadHeadlines();
       $scope.items = HeadlinesService.headlines;
       $scope.page  = HeadlinesService.args.page;
       $scope.start = HeadlinesService.args.start;



}])

// THIS NEEDS TO BE INCLUDED SOEWHERE IN THE ARTICLES MODULE
.controller('ManageArticlesController',['$scope','ArticlesResource','ArticlesMessenger',
    function($scope,ArticlesResource,ArticlesMessenger){

    }
])

.controller('NewArticleController', ['$scope','ArticlesResource','ArticlesMessenger','WatcherService',
    function ($scope,ArticlesResource,ArticlesMessenger,WatcherService) {
    
    $scope.article = {};

    $scope.resetForm = function(){
        $scope.article.title   = "";
        $scope.article.content = "";
        $scope.article.user    = {};
        $scope.ArticlesForm.$setPristine();
    };

    $scope.saveArticle = function(u){
        $scope.article.user          = {};
        $scope.article.user.userId   = u.userId;
        $scope.article.user.username = u.username;
      
        ArticlesResource.main.save($scope.article)
        .$promise.then(function(res){

            WatcherService.markDirty('articlesWatcher',['articles','headlines']);
          
            $scope.resetForm();
            ArticlesMessenger.success(res);
        },function(res){
            $scope.resetForm();
            ArticlesMessenger.error(res);
        });
    };
}])

// add methods for asyncronis loading here . If not this will overload the pages.
.controller('ViewArticlesController',['$scope','$state','ArticlesService','WatcherService',
    function($scope,$state,ArticlesService,WatcherService){     

    var _this = {};
    _this.construct = function(){  
       
        $scope.edit       = false;
        $scope.single     = false;

        if ($state.params.id) {
            $scope.single   = true;
            ArticlesService.getArticle({_id: $state.params.id});
        } else {
            ArticlesService.loadArticles();
        }
        $scope.articles   = ArticlesService.articles;
        $scope.totalItems = ArticlesService.args.count;
        $scope.perPage    = ArticlesService.args.limit;
        $scope.page       = ArticlesService.args.page;   
    };
   
 
    // load more function for lazy loading articles.
    $scope.loadMore = function(){
        var per = ($scope.perPage + $scope.perPage);
        $scope.perPage        = per;
        ArticlesService.args.limit = per;
        _this.construct();
    };
  
    $scope.setPerPage = function(){
       ArticlesService.args.limit = $scope.perPage;  
       ArticlesService.args.update();
       _this.construct();
    };
    
    $scope.pageChanged = function(pn){
        ArticlesService.args.changePage(pn);
        _this.construct();
    };

    $scope.isAuthor = function(aid,user){
        return (aid === user.userId)? true : false;
    };
    
    $scope.newArticle = function(){
        var current = $scope.new;
        $scope.new  = (!current)? true : false;
    };
    
    $scope.editArticle = function(id){
        var current = $scope.edit;
        $scope.edit = (!current)? id : false;
    };
    
    $scope.removeArticle = function(id){
        for(var i in $scope.articles){
            if($scope.articles[i]._id === id){
                $scope.articles.splice(i,1); 
            } 
        }
        ArticlesService.removeArticle(id);
        WatcherService.markDirty('articlesWatcher',['articles','headlines']);
        _this.construct();

    };
    
    $scope.updateArticle = function(article){
        $scope.edit = ArticlesService.updateArticle(article);
    };

    $scope.shouldEdit = function(id){
        return ($scope.edit === id)? true : false;
    };
    
    $scope.createDate = function(d){
        return d.toDateString();
    };
    
    $scope.getHref = function(id){
       $state.go('articles.one', { 'id':id});
    };
    
      _this.construct();
}])

.controller('ArticlesHeadlineController',['$scope','$state','HeadlinesService',
    function($scope,$state,HeadlinesService){

    var _this = {};
    _this.construct = function(){ 
       HeadlinesService.loadHeadlines();
       HeadlinesService.args.limit = 3;
       $scope.articles = HeadlinesService.headlines;
       $scope.page     = HeadlinesService.args.page;
       $scope.start    = HeadlinesService.args.start;
    };
    _this.construct();
       
    $scope.pageChanged = function(index){
        HeadlinesService.args.changePage(index);
        _this.construct();
    };
  
    $scope.moreHeadlines = function(){
        HeadlinesService.args.nextPage();
       _this.construct();
    };
    
    $scope.lessHeadlines = function(){
        HeadlinesService.args.lastPage();
        _this.construct();
    };

    $scope.getHref = function(id){
       $state.go('articles.one', { 'id':id});
    };    
}])

.controller('HeadlinesCursorController',['ArticlesResource','HeadlinesService','$scope',
    function(ArticlesResource,HeadlinesService,$scope){
        $scope.pages        = []; 
        $scope.currentPage  = HeadlinesService.args.page;

        var  _this = {};
        _this.construct = function(){
             ArticlesResource.count.query()
               .$promise.then(function(res){
               var pages = [];
               var tp = Math.ceil(res.total / HeadlinesService.args.limit);
                for(var i=0; i < tp; i++){
                    pages.push(i);
                }
                $scope.pages = pages;
           });   
        };
        _this.construct();
        
}]);