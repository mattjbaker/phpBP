'use strict';

// forgot, reset, editAccount, register, and login. 
angular.module('users')


.controller('UsersForgotController',['$scope','UsersResource','UsersMessenger',
    function($scope,UsersResource,UsersMessenger){
        $scope.formBehavior = {updateOn:'default blur', debounce:{'default': 300,'blur':0}};
        $scope.newkey = null;

        $scope.forgotpassword = function () {
        
             UsersResource.main.update({id:'forgot'},{email:$scope.email})
            .$promise.then(function (res) {
                $scope.success = true;
                $scope.newkey  = res.key;
                UsersMessenger.success(res.msg);
            }, function (er) {
                UsersMessenger.error(er);
            });
        };
    }
])

//IDK if this is easier to understand or not... not even sure why i
// decided to write the nav controllers this way.
.controller('UsersSettingsNavController',['$scope','$state',
    function($scope,$state){
            
        var _this = {};

        _this.construct = function(){
            
           return {
                title: 'Edit Your:',
                links: [
                    {
                        title: 'Profile',
                        href: 'users/profile',
                        id: 'cnProfile',
                        current: _this.isCurrent('users.profile')
                    }, {
                        title: 'Password',
                        href: 'users/password',
                        id: 'cnPassword',
                        current: _this.isCurrent('users.password')
                    }, {
                        title: 'Account',
                        href: 'users/account',
                        id: 'cnAccount',
                        current: _this.isCurrent('users.account')
                    }
                ]};
        };      

        $scope.$on('$stateChangeSuccess', function() {
            $scope.nav = _this.construct();
        });

        _this.isCurrent = function (val) {
            return ($state.current.name === val) ? 1 : 2;
        };

       $scope.nav =  _this.construct();
     
}])
   
// Form for email input to verify a user password reset request.   
.controller('UsersChangePasswordController',['$scope','UsersResource',
        function($scope,UsersResource,UsersMessenger){
          
            $scope.formBehavior = {updateOn:'default blur', debounce:{'default': 300,'blur':0}};
          
            $scope.changePassword = function(){
                UsersResource.main.update($scope.user)
                .$promise.then(function(ret){
                    $scope.user = {};
                    UsersMessenger.success(ret);
                });
            };
        }
    ])

// Form to create the new password for an authenticated reset request
.controller('UsersResetController',['$scope','$state','UsersResource','UsersMessenger',
    function($scope,$state,UsersResource,UsersMessenger){

        $scope.formBehavior = {updateOn:'default blur', debounce:{'default': 300,'blur':0}};
        $scope.user = {};
        var _this   = {};
        
        _this.construct = function(){
            if(!$state.params.hashkey){
                return $state.go('home'); // redirect with no hash
            }
            UsersResource.keyval.get({},{key:'pending',val:$state.params.hashkey})
            .$promise.then(function(ret){
               $scope.user.hashkey = $state.params.hashkey;
               $scope.user = ret[0];
            },function(er){ 
                console.log(er);
                return $state.go('home'); 
            });
        };

        $scope.resetpassword = function(){

          UsersResource.verb.update({verb:'reset',key:'pending',val:$state.params.hashkey},$scope.user)
             .$promise.then(function(ret){
              UsersMessenger.success(ret);            
          },function(er){
              UsersMessenger.error(er);
          });                                      
        };
        _this.construct();
    }
])


// converted
.controller('UsersRegisterController',['$scope','UsersResource','UsersMessenger','AuthService',
    function($scope,UsersResource,UsersMessenger,AuthService){
                
       $scope.user = {};
       $scope.orig = {};
       $scope.res  = UsersResource;
       $scope.formBehavior = {updateOn:'default blur', debounce:{'default': 300,'blur':0}};
       
         // create a new user. go ahead and log them in.       
        $scope.register = function(){
             UsersResource.main.create($scope.user)
             .$promise.then(function(ret){
                  AuthService.login(ret);
              },function(er){
                  UsersMessenger.error(er);
              });
        };
    }
  ])
  
  
// EDIT ACCOUNT
.controller('UsersEditAccountController', ['$scope',
 'Session','UsersResource','UsersMessenger',
    function ($scope,Session, UsersResource,UsersMessenger) {

        $scope.orig = {}; // valid cache
        $scope.user = {};
    
        $scope.formBehavior = {updateOn:'default blur', debounce:{'default': 300,'blur':0}};

        UsersResource.main.get({}, {'_id': Session.userId})
            .$promise.then(function (res) {
            $scope.orig = angular.copy(res[0]); // cahce to avoid invalidating current settings
            $scope.user = res[0];
        });


        $scope.update = function () {
            UsersResource.main.update(Session.userId,$scope.user)
            .$promise.then(function (res) {
                UsersMessenger.success(res);
            },function(er){
                UsersMessenger.error(er);
            });
        };
        
        $scope.register = function(){
            return $scope.update();
        };
        
    }
])

// LOGIN
.controller('UsersLoginController', ['$scope','$state','AuthService',
    function ($scope,$state,AuthService) {
        
        $scope.auth = function(auth){
            return (auth)? null : $state.go('home');
        };
        
        $scope.login = function(){
            AuthService.login($scope.user);
            $scope.user = {};
            $scope.LoginForm.$setPristine();
        };
    }
])

.controller('TestAuthController',['$scope','$http',function($scope,$http){
  $http.get('api/users/testauth').then(function(ret){
      $scope.token = ret.data;
  },function(er){
      $scope.token = er;
  });
}]);
