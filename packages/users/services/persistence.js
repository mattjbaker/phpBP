/* 
 * Object to store user persistance objects for state retention.
 */
angular.module('users')

.service('Persistence',['$localStorage','$sessionStorage',
    function($localStorage,$sessionStorage){

        this.isActive = false;
        if(!this.isActive){ return; }else{
                    if (angular.isUndefined($localStorage.persist)) {
                        $localStorage.persist = {};
                    }
                }
        this.dumpState = function(arg){
            return (arg)? dump($localStorage.persist[arg]) : dump($localStorage.persist);
        };
        
        this.isValid = function(key){   
            
        
            if($localStorage.persist[key]){
                 console.log(key + ' persistence found');
                 return true;
            }
            return false;
        };
        
        this.removeState = function(key){
            delete  $localStorage.persist[key];
        };
        
        this.saveState = function(key,object){
            console.log('Persistent State of ('+key+') Saved');
            $localStorage.persist[key] = object;
        };
        
        this.getState = function(key){
            if(this.isValid(key)){
                return $localStorage.persist[key];
            }
            return false;
        };
}]);
