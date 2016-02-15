'use strict';
angular.module('gallery')


.controller('SlideGalleryViewController',['$scope','FilesService','Session',
function($scope,FilesService,Session){
    $scope.items    = [];
    $scope.selected = 0;
    $scope.current  = null;
    $scope.data     = FilesService.getInstance(JSON.stringify($scope.id));

    $scope.loadItems = function(){
        $scope.data.loadAllUserFiles()
        .$promise.then(function(res){
            $scope.items = res;
        });
    };    
}])

// will create array of galleries.
.controller('GalleryController',['$scope','Session',
    function($scope,Session){
        $scope.galleries = [{title:'one'},{title:'two'}];
}])

.controller('GalleryViewController',['$scope','FilesService','Session',
function($scope,FilesService,Session){
    
    $scope.items      = {};
    $scope.pages      = [];
    $scope.totalpages = 0;
    $scope.tp         = 0;
    $scope.cpage      = 1;
    $scope.unit_width = 120;
    // maybe create new instances like this.
    $scope.data       = FilesService.getInstance(JSON.stringify($scope.$id));
    $scope.title      = "Image Gallery for "+ Session.username;
    $scope.totalItems = $scope.data.args.count;
  
    $scope.itemsObject = null;
    console.log($scope.data);
    $scope.nextPage = function(){
        $scope.data.args.nextPage();
    };
    
    $scope.lastPage = function(){
        $scope.data.args.lastPage();
    };
    
    $scope.setLimit = function(i){
        $scope.data.args.limit = i;
        if( i > $scope.data.args.count.total){
            i = $scope.data.args.count.total;
            $scope.data.args.update();
        }
    };
    
    $scope.setPages = function(){
        $scope.pages = [];
        var tp = Math.ceil($scope.data.args.count.total / $scope.data.args.limit) || 1;
        for (var i = 0; i < tp; i++) {
            $scope.pages.push(i);
        }
        $scope.tp = tp;
    };
    
    $scope.loadPage = function(i){
      $scope.data.args.changePage(i); 
      $scope.loadItems();
    };
    
    $scope.loadItems = function(){
        $scope.data.args.update();
        $scope.items = $scope.data.loadUserFiles();
        $scope.setPages(); 
        $scope.cpage = $scope.data.args.page; 
        $scope.itemsObject = JSON.decycle(JSON.stringify($scope.data));
    };     
    
    $scope.loadItems();
}])

.controller('ViewGalleryCarouselController',['$scope','Session','FilesService',
function($scope,Session,FilesService){
    
    var _this    = {};
    $scope.files = {};
    $scope.data  = {};
    
    $scope.myInterval   = 5000;
    $scope.noWrapSlides = false;
  
    _this.construct = function(){
       $scope.data  = new FilesService(Session.userId);
       _this.reload();
    };
    
    _this.reload = function(){
       $scope.files =  $scope.data.loadAllbyUser();
    };
    
    _this.construct(); 
}])

.controller('ViewUserFilesListController',['$scope','Session','FilesService',
function($scope,Session,FilesService,TestService){
    
    var _this    = {};
    $scope.data  = {};
    $scope.files = {};
     
    _this.construct = function(){
       $scope.data  = new FilesService(Session.userId);
       _this.reload();
    };
    _this.reload = function(){
        $scope.files = $scope.data.loadUserFiles();  
    };
    
    _this.construct(); 
}])

// uploader control.
.controller('FileUploadController', ['$scope', 'Upload','Session', '$timeout',
function ($scope, Upload, Session, $timeout) {
  
    $scope.$watch('files', function () {
         $scope.upload($scope.files);
    });     
    $scope.$watch('file', function () {
        if ($scope.file !== null) {
            $scope.files = [$scope.file]; 
        }
    });
    $scope.log      = '';
    $scope.response = '';
    $scope.progress = [];
    $scope.preview  = [];

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
              var file = files[i];
              if (file) {
                Upload.upload({
                        url: 'api/files',
                        method: 'POST',
                        file: file,
                        sendFieldsAs: 'form',
                        data:{
                            user:Session.userId
                        }
                    }
                ).then(function(resp) {
                                     
                    $timeout(function() {
                        $scope.preview.push(resp.data); 
                        $scope.response = resp.data;
                   });
                }, null, function(evt) {
                  
                  $scope.response = evt;
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);

                     });                     
                }  
            }
        }
    };
}]);