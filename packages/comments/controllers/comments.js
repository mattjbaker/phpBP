/* Created by Matt Baker 2015
 * comments is has been abstracted to its own core package to 
 * allow for use with any module.
 */
'use strict';

angular.module('comments')

.controller('CommentsRecentController',function(){
    
})
.controller('CommentsIscolateController',['$scope','$state',
    function($scope,$state){
        
       $scope.parent  = $state.params.id;
  
       $scope.bookmark = function(){
           alert('create a bookmark for this thread');
       };
}])

.controller("CommentsViewContoller",['$scope','$location','CommentsResource','CommentsService',
           'CommentsMapper','Session',
    function($scope,$location,CommentsResource,CommentsService,CommentsMapper,Session){
  
    
    $scope.auth     = !!Session.userId;
    $scope.comments = {};
    $scope.edit     = false;
    
     var _this = {};
    _this.construct   = function(){  
        $scope.thread = new CommentsService($scope.parent);
        _this.update();
    };

    $scope.isCollapsed = function(id){
        return CommentsMapper.collapsed[id];
    };
    
    $scope.isAuthor = function(id){
        return (id === Session.userId)? true : false;
    };
        
    $scope.shouldEdit = function(id){
         return ($scope.edit === id)? true : false;
    };

    $scope.updateComment = function(comment){
       CommentsResource.main.update(comment._id,comment)
       .$promise.then(function(res){
            $scope.edit = false;
       });
    };

    $scope.editComment = function(id){
        var current = $scope.edit;
        $scope.edit = (!current)? id : false;
    };
    
    // Listens for the new comment event.
    $scope.$on('newmessage', function(event,msg) {
        if(msg === $scope.parent){  
           CommentsMapper.collapsed[$scope.parent] = false;
            _this.construct();
        }
    });

    $scope.loadNext = function(){
        $scope.thread.nextPage();
        _this.update();
    };
    
    $scope.loadLast = function(){
       $scope.thread.lastPage();
        _this.update();
    };
    
    $scope.lastIndexOnPage = function(index){
        return (index === $scope.comments.length - 1)? true : false;
    };
    
    $scope.removeComment = function(id){
        $scope.thread.removeComment(id); 
        _this.construct();
    };
    
    $scope.lastIndex = function(index){
        return (index === $scope.thread.args.count.total -1)? true : false;
    };
    
    $scope.hasChildren = function(id){
        return (CommentsMapper.children[id])? CommentsMapper.children[id].total : 0;
    };
    
    $scope.hasPages = function(id){
        return ($scope.thread.args.count.total > $scope.thread.args.limit)? true : false;
    };
    
    $scope.isolateComments = function(id){
       $location.path('/comments/main/'+id);
    };
    
    $scope.numPages = function(){
        return  Math.ceil($scope.thread.args.count.total / $scope.thread.args.limit);
    };
    
    _this.update = function(){
        $scope.thread.changeLimit($scope.limit);
        $scope.thread.loadComments().$promise.then(function(res){
           $scope.comments = res; 
        });
    };
    
    _this.construct();
      
}])

.controller("CommentsFormController",['$scope','$rootScope','CommentsResource','Session',
    function($scope,$rootScope,CommentsResource,Session){
        
        $scope.comment          = {};
        $scope.comment.parent   = $scope.parent;
        $scope.comment.userid   = Session.userId;
        $scope.comment.root     = $scope.root;
        $scope.auth = !!Session.userId;
     
        $scope.saveComment = function(){         
            if(!$scope.comment.content){
               $scope.visible =false;
               return;
           }
           // alert($scope.parent);
          CommentsResource.main.save($scope.comment)
          .$promise.then(function(ret){
            $scope.comment.content = "";
            $scope.visible = false;
            // this broadcast message notifies the view of an update
            $rootScope.$broadcast('newmessage',$scope.parent);
            
            console.log(ret);
          },function(er){
            $scope.comment.content = "";
            console.log(er);
          });
        };
    }
]);