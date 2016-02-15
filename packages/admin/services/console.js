'use strict';

angular.module('admin')
        .factory('consoleCommands', ['$http', '$q', 'Session', '$window', 
    function ($http, $q, Session, $window) {


                var argError = function (cmd) {
                    return "<i style=\"color:grey;\" class='fa fa-exclamation-triangle'> </i> <i>" + cmd + " takes one or more arguments</i>";
                };

                // returns a deep nested object from array of strings.
                var findobject = function (obj, is) {
                    return is.length ? findobject(obj[is[0]], is.slice(1)) : obj;
                };

          
                return{

                    whoami: function () {
                        return Session.username + "<br>";
                    },

                    object: function (args) {

                        var ret = null;
                        if (!args[1]) {
                            var ret = JSON.decycle(window);
                        } else {
                            var n = args[1].split('.');
                            var obj = JSON.decycle(window);
                            var ret = findobject(obj, n);
                        }

                        return "<pre style=\"color:#cccccc; overflow-x:hidden; overflow-y:scroll; background-color:#333333;\">" + JSON.stringify(ret, null, 3) + "</pre>";
                    },
                    apis: function(args){
                        $http.get("api/"+args[1])
                                .success(function(ret){
                                    return ret;
                                }).error(function(er){
                               return er;     
                            });
                    },
                    unknown: function (cmd) {
                        return "<i style='color:grey;' class='fa fa-exclamation-triangle'></i>Unknown Command <i> " + cmd + "</i>";
                    },
                    date: function () {
                        return new Date();
                    },
                    set: function () {
                        var time = new Date();
                        var user = Session.username;
                        return "Developer terminal initialized by: " + user + " <br>" + time + "<br>use 'help' for commands";
                    },
                    user: function (args) {
                        if (args[1] === 'exists') {
                            return "User exists";
                        } else if (args[1] === 'profiles') {
                            return "User Profiles";
                        } else if (args[1] === 'create') {
                            return args[2] + " create user";
                        } else {
                            return argError(args[0]);
                        }
                    },
                    help: function (args) {
                        if (angular.isDefined(args[1])) {
                            if (args[1] === 'stat') {
                                return "stat [<i>modules | packages</i>]";
                            }
                            if (args[1] === 'user') {
                                return "user [<i>profiles</i>]<br>" +
                                        "user [<i>create</i>][<i>JSON</i>]";
                            }
                        }
                        return "Current available commands are.<br>-help<br>-clear<br>-stat<br>-user<br>-exit";
                    },
                    stat: function (args) {
                        if (args[1] === 'packages' ||
                                args[1] === 'modules') {
                            var content = "";

                            for (var i in angular.modules) {
                                content = content + '<li>' + angular.modules[i] + '</li>';
                            }
                            return "<ul>" + content + "</ul>";
                        }
                        return argError(args[0]);

                    },
                    package: function (args) {
                    var deferred = $q.defer();
                    if(!args[1]){ return argError(args[0]);}
                        var ret;
                        $http.post('api/packages/new', {name: args[1]})
                        .success(function (ret) {

                            deferred.resolve(ret);
                            // return JSON.stringify(ret,null,4);
                        }).error(function (er) {
                            deferred.reject(er);

                            // return JSON.stringify(er,null,4);
                         });
                         return deferred.promise;
                    }                  
                };
            }
        ]);
