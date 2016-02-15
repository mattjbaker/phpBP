/* 
 * Created by Matt Baker 2015
 * Ive chosen to keep separate these core resources. 
 */
'use strict';
angular.module('users')

        .factory('AuthResource',['ResourceService',function(ResourceService){
                ResourceService.addCustomResource('auth',               
                {url:'api/auth/:id',
                args:{id:'@_id'},
                methods:{login:{method:'POST'},
                        logout:{method:'DELETE'},
                  authenticate:{method:'PUT'}}});
                
                return ResourceService.getResource('auth');
        }])
        .factory('UsersResource',['ResourceService',function(ResourceService){
               // ResourceService.createResource('users');
                return ResourceService.getResource('users',true);
        }]);
        



//
//    .factory('AuthResource',['$resource',function($resource){
//                
//    return $resource('api/auth/:id',{id:'@_id'},{
//        login:{
//            method:'POST'
//        },
//        logout:{
//            method:'DELETE'
//        },
//        authenticate:{
//            method:'PUT'
//        }
//    });   
//    
//}])
//
//.factory('UsersResource',['$resource',function($resource){
//   
//    var _this= {};
//   
//    _this.main=(function(){
//        return $resource('api/users/:id',{id:'@_id'},{
//        create:{
//            method:'POST'
//        },
//        update:{
//            method: 'PUT'
//        },
//        get:{
//            method: 'GET',
//            isArray: true
//        },
//        remove:{
//            method: 'DELETE'
//        }});
//    })();
//    
//    _this.keyval = (function(){
//        return $resource('api/users/:key/:val',{key:'@key',val:'@val'},{
//        get:{
//            method: 'GET',
//            isArray: true
//        }});  
//    })();
//    
//    _this.verbkeyval =(function(){
//        return $resource('api/users/:verb/:key/:val',{verb:'@verb',key:'@key',val:'@val'},{
//        update:{
//            method: 'PUT'
//        },
//        get:{
//            method: 'GET',
//            isArray: true
//        },
//        exists:{
//            method: 'GET'
//        }
//        });
//     })();
//       
//    return _this;
//            
//}]);
