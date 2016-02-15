/* 
 * Created by Matt Baker 2015
 */

angular.module('docs')
        .controller('DocsNavController',['$scope','$state',
        function($scope,$state){
    
         var _this = {};
            
          $scope.$on('$stateChangeSuccess', function() {
             $scope.nav = _this.construct();
             
          });


          _this.isCurrent = function(val){
            return ($state.current.name === val)? 1 : 2;
          };
        
        _this.construct = function(){

        return {
            
            title: 'DOCS:',
            links: [
                {
                    title: 'Index',
                    href: 'docs/index',
                    id: 'cnIndex',
                    current: _this.isCurrent('docs.index')
                }, {
                    title: 'server',
                    href: 'docs/server',
                    id: 'cnServer',
                    current: _this.isCurrent('docs.server')
                }, {
                    title: 'Services',
                    href: 'docs/services',
                    id: 'cnServices',
                    current: _this.isCurrent('docs.services')
                }, {
                    title: 'Compile',
                    href: 'docs/compile',
                    id: 'cnCompile',
                    current: _this.isCurrent('docs.compile')
                }, {
                    title: 'AngularJs',
                    href: 'docs/angular',
                    id: 'cnAngular',
                    current: _this.isCurrent('docs.angular')
                }]};  
    };
   $scope.nav = _this.construct();
     
}]);


