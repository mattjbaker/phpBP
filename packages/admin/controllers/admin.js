'use strict';



angular.module('admin')
        .controller('AdminSettingsController',['$scope','$state','SettingsService','Utils',
      
        function($scope,$state,SettingsService,Utils){
                 
            $scope.settings = {};
            $scope.islocked = [];
            
            SettingsService.getSettings()
             .then(function(res){
                 $scope.settings = res; 
                 if($scope.settings.FRONTSIDE.COMPILE_FLAG === ""){
                    $scope.settings.FRONTSIDE.COMPILE_FLAG = "false";
                 }
                 angular.forEach( Utils.getKeys(res),function(k){
                     $scope.islocked[k] = true;
                 });
              },function(){
                     $scope.settings = null;
              });

            $scope.lockedSwitch = function(index){
              var keys = Utils.getKeys($scope.settings);
              $scope.islocked[keys[index]] = (!$scope.islocked[keys[index]])? true : false;
            };
              
            $scope.undo = function(){
                $state.reload();
            };
              
            $scope.reset = function(){
               SettingsService.restoreDefaults(); 
            };
              
              // not working
            $scope.update = function(){
                if($scope.settings.FRONTSIDE.COMPILE_FLAG.toLowerCase() === 'false' ||
                   $scope.settings.FRONTSIDE.COMPILE_FLAG.toLowerCase() === 'null'){
               
                    $scope.settings.FRONTSIDE.COMPILE_FLAG = "";
                }
             
                  SettingsService.update($scope.settings)
                  .then(function(result){
                      if($scope.settings.FRONTSIDE.COMPILE_FLAG === ""){
                         $scope.settings.FRONTSIDE.COMPILE_FLAG = "false";
                        }
                        // add successs
                      },function(error){
                         // add error.
                  });
            };
        }
    ]);
    
angular.module('admin')
        .controller('AdminConsoleController',['$scope',
        function($scope){
            $scope.visible = false;
            $scope.switchConsole = function(){
                $scope.visible = ($scope.visible)? false : true;
            };
        }
]);
   
angular.module('admin')
        .controller('AdminCreateUsersController',['$scope','$state','AuthService','USER_ROLES',
       
        function($scope,$state,AuthService,USER_ROLES){
            
            $scope.userRoles  = angular.copy(USER_ROLES);
            $scope.user       = {};
            // set roles to array and insert new user.
            $scope.createUser = function(){
               
                 // add new user here.
                 AuthService.register($scope.user,false)
                     .then(function(ret){
                        $scope.user = {};
                        $state.reload();
                     });
            };
        }
]);

angular.module('admin')
        .controller('AdminAccountsController',['$scope','$state','UsersResource','USER_ROLES',
        function($scope,$state,UsersResource,USER_ROLES){
             
             $scope.userRoles = angular.copy(USER_ROLES);
             
             $scope.findUser          = "";
             $scope.rowCollection     = [];
             $scope.displayCollection = [];
             $scope.itemsPerPage = 5;
           
             $scope.removed     = [];
             $scope.changed     = [];
             $scope.total_users = 0;
           
             $scope.locked  = true;
            
            
            UsersResource.main.query()
            .$promise.then(function(ret){    
                 $scope.rowCollection = ret;
                 $scope.users = ret;
                 $scope.displayCollection = [].concat($scope.rowCollection);
                 $scope.total_users = ret.length;

            });
            

            
            $scope.lockedSwitch = function(){
               $scope.locked = (!$scope.locked)? true : false;
            };
          
            $scope.undo = function(){
                $state.reload();
            };
            
            $scope.addChanged = function(row){
                $scope.changed[row._id] = row;
            };
        
            $scope.update = function(){
              
               // update all the changes.
                for (var i in $scope.changed) {  
                    
                   UsersResource.main.update($scope.changed[i]._id,$scope.changed[i])
                   .$promise.then(function(ret){
                       dump(ret + "You need to fix this message service!");
                   },function(er){
                       dump(er + "You need to fix this message service");
                   });
                }

                // update all the deletes.
                angular.forEach($scope.removed, function (c) {
                    //UserService.deleteUser(c);
                    UsersResource.main.remove({},{id:c})
                    .$promise.then(function(ret){
                        dump(ret);
                    },function(er){
                        dump(er);
                    });
                });
            };

            $scope.removeItem = function(row) {
              
                var index = $scope.rowCollection.indexOf(row);
                if (index !== -1) {
                    $scope.rowCollection.splice(index,1);
                    $scope.displayCollection.splice(index,1);
                    $scope.removed.push(row._id);
                    
                }
            };  
        }
    ]);
      

angular.module('admin')
    .controller('AdminUserSettingsController',['$scope','AuthService','UsersResource',
    function($scope,AuthService,UsersResource){

    $scope.user = {};
//    $scope.sess = {};
   
    $scope.construct=function(user){
        $scope.user    = user;
     };
     
    $scope.isPending = function(){
        return !!$scope.user.pending;
    };
  
    $scope.resetPassword = function(){
        var query = {'address':$scope.user.email};
        AuthService.forgotPass(query);
    };
    
    $scope.lockAccount     = function(){  
        $scope.user.locked = ($scope.user.locked)? false : true;
        UsersResource.update({id:$scope.user._id},$scope.user)
        .$promise.then(function(ret){
        },function(er){
        });
    };
        
}]);         
 