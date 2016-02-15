'use strict';

angular.module('system')
.factory('Utils', ['$http', function ($http) {
    return {

        moduleExists: function (mod) {
            angular.forEach(angular.modules, function (m) {
                if (mod === m) {
                    return true;
                }
            });
            return false;
        },
        listToArray: function (list) {
            return list.split(',');
        },
        arrayToList: function (array) {
            var ret;
            for (var i in array) {
                if (i <= 0) {
                    ret = array[i];
                } else {
                    ret = ret + "," + array[i];
                }
            }
            return ret;
        },
        listOrArray: function (values) {
            if (angular.isArray(values)) {
                return arrayToList(values);
            }
            return listToArray(values);
        },
        getKeys: function (obj) {
            var r = [];
            for (var k in obj) {
                if (!obj.hasOwnProperty(k))
                    continue
                r.push(k);
            }
            return r;
        },
        compareArr: function (array1, array2) {
            for (var i in array1) {
                for (var x in array2) {
                    if (array1[i] === array2[x]) {
                        return true;
                    }
                }
            }
            return false;
        }
    };
}]);