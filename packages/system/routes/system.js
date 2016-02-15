'use strict';

// Setting up route
angular.module('system')
.config(['$httpProvider','$stateProvider','$urlRouterProvider',
    function($httpProvider,$stateProvider, $urlRouterProvider) {

     // Redirect to home view when route not found   
    $urlRouterProvider.otherwise('/');

    // Home state routing
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'packages/system/view/home.html'
    });
}
])

.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    }
])

// cache any global templates
.run(['Templates',
function (Templates) {
    

Templates
.add({name:'nav-main',url: 'packages/system/view/nav.html'})
.add({name:'nav-crumb',url:'packages/system/view/partials/nav-crumb.html'})
.add({name:'validator-msg-pending',url:'packages/system/view/partials/validator-msg-pending.html'})
.add({name:'validator-msg-errors', url:'packages/system/view/partials/validator-msg-errors.html'})
.add({name:'msg-message',url:'packages/system/view/partials/msg-message.html'})
.add({name:'paginator-cont',url:'packages/system/view/partials/paginator.html'});
// Only call template compile once.
Templates.compile();
    
}])

.run(['$rootScope','$state','AUTH_EVENTS','AuthService','ResourceService',
  function($rootScope,$state,AUTH_EVENTS,AuthService,ResourceService) {

     
      $rootScope.$on('$stateChangeStart', function (event, next) {  
               // used to "lazy load" and or re-load resources
               // ResourceService.flushResources();
                if ('data' in next && 'roles' in next.data ) {
                    
                    
                    AuthService.resumeSession().then(function(){
                            
                        var roles = next.data.roles;

                            if (!AuthService.isAuthorized(roles)) {

                                event.preventDefault();

                                if (AuthService.isAuthenticated()) {
                                    // not allowed
                                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                                } else {
                                    // not loged in
                                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                                }
                            }
                        
                    },function(){
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                    });
                }           
          });
    
    
    $rootScope.$on('RELOAD',function(){
       console.log("Site refreshed");
       $state.reload();
    });
    $rootScope.$on(AUTH_EVENTS.sessionTimeout,function(){
        console.log("User Session timed out");
    });
    
    $rootScope.$on(AUTH_EVENTS.userPendingReset,function(){
        console.log("User marked for password reset");
    });
    
    $rootScope.$on(AUTH_EVENTS.loginSuccess,function(){
        console.log("User loged in");  
        $state.go('home');
    }); 

    $rootScope.$on(AUTH_EVENTS.loginFailed,function(){
        console.log("Login falure");
    });
    
    $rootScope.$on(AUTH_EVENTS.logoutSuccess,function(){
        console.log("User loged out");
        $state.go('home');
    });
    
    $rootScope.$on(AUTH_EVENTS.userCreated,function(){
        console.log("New user has been added");
    });
    
    $rootScope.$on(AUTH_EVENTS.notAuthenticated,function(){
       // not authenticaated event.
       // if user has not loged in.
        console.log("Not Authenticated"); 
        $state.go('home');
    });
    
    $rootScope.$on(AUTH_EVENTS.notAuthorized,function(){
       // if user roles dont match up.
       // alert("not authorized")      
       console.log("Not Authorized");
       $state.go('home');
    });
    
    $rootScope.$on(AUTH_EVENTS.sessionRevoked,function(){
       $state.reload();
       $state.go('home'); 
    });
    
}]);

