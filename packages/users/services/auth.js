'use strict';

angular.module('users')
   .factory('AuthService',['$rootScope','AUTH_EVENTS','$http','$q',
    '$cookies','Session','MSG','MessageService',
    'AuthMessenger',
    'AuthResource',
    'Utils','$localStorage','$sessionStorage',
    function ($rootScope,AUTH_EVENTS,$http,$q,$cookies,Session,
    MSG,MessageService,
    AuthMessenger,
    AuthResource,
    Utils,$localStorage,$sessionStorage) {
    
       var authService = {};
       
       authService.getToken = function(){
            var key = $localStorage.auth_token;
            return (!key)? false : key;
       };
       
       authService.setSession = function(obj){
           $sessionStorage.session = obj;
       };
       
       authService.getSession = function(){
           if($sessionStorage.session){
               return $sessionStorage.session;
           }
           return Session;
       };
       
       
       authService.setToken = function(value){
            $localStorage.auth_token = value;
            $http.defaults.headers.common["Authorization"]= value;

          return;
       };

    
        authService.revokeSession = function(key){  }; 

       
        // login auth process.
        authService.login = function(query){
           AuthResource.login(query)
           .$promise.then(function(res){
               authService.createSession(res);
               $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
           },function(er){
               AuthMessenger.error(er);
           });
        };
        
        authService.logout = function(){
            var key = authService.getToken();
            authService.setToken(null);
            authService.setSession(null);
            Session.destroy();
        };
       
               
        // Forgot Password - should return a new unique hash.
//        authService.forgotPass = function(query){
//            var deferred = $q.defer();
//            $http.put('api/users/forgot',query)
//                .success(function(ret){
//                  deferred.resolve(ret);
//                  $rootScope.$broadcast(AUTH_EVENTS.userPendingReset);
//                  MessageService.addMessage([MSG.KEYS.forgotMsg],ret,
//                  MSG.CLASS.alertSuccess);
//                }).error(function(er){
//                
//                  deferred.reject(er);
//                  MessageService.addMessage([MSG.KEYS.forgotMsg],er,
//                  MSG.CLASS.alertError);
//            });
//            return deferred.promise;
//        };

        // creates a front user session Login step three.
        authService.createSession = function(response){
       
            authService.setToken(response.auth);  
            
            Session.create(
                    response._id,
                    response.roles, 
                    response.username,
                    response.name,
                    response.email,
                    response.data);
                    
            authService.setSession(Session);  
           // $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        };
       
        // Recover user session.
        // THIS NEEDS TO USE THE PUT METHOD to renew the user session from the APIs
        // COMPLETE
        authService.resumeSession = function(){           
                
            var diferred = $q.defer();
           // var key  = $cookies.get('main.session');
            var key  = authService.getToken();
//            var newkey = $localStorage.getItem('main.session');
           
           if(key){
               
            $http.put('api/auth/',{'token':key})
              .success(function (response) {
                 // if(!response){return;}
                 if(response === 'expired'){ 
                    diferred.reject('expired');
                    authService.logout();
                    $rootScope.$broadcast(AUTH_EVENTS.sessionTimeout);
                  } // logout expired        
                 // alert("recieved succesfull session resume response from api");
         
                 authService.createSession(response);
                 diferred.resolve(Session._id); 
            }).error(function(er){
              
                 $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);              
                 authService.logout();   
                 diferred.reject();
            });
            }else{ diferred.reject();}
            return diferred.promise;
        };
        
        // Accessed by application controller
        authService.isAuthenticated = function () {  
          return !Session.userId; //!!authService.getSession();
        };
        
        //Accessed by application controller
        authService.isAuthorized = function (authorizedRoles) {
            
          if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
          }
          
          return Utils.compareArr(authorizedRoles,Session.userRoles);

        };
 
    return authService;
}
]);

angular.module('users')        
.service('Session', [ function () {

  this.create = function (userId,userRoles,username,name,mail,data) {
    this.userId    = userId;
    this.userRoles = userRoles || ['*'];
    this.username  = username;
    this.name      = name;
    this.mail      = mail;
    this.data      = data;

  };
  this.destroy = function () {
    this.userId    = null;
    this.userRoles = ['*'];
    this.username  = null;
    this.name      = null;
    this.mail      = null;
    this.data      = {};

  };
}]);