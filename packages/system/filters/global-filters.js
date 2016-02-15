'use strict';
      
angular.module('system')
    .filter('fromNow',function(){
        return function(value){
            var m = new moment(value);
            return m.fromNow();
        };
}); 

angular.module('system').filter('pluralize',function(){
    return function (count,word,brackets,zero){
        // count is the number compared.
        // word is the singular word
        // brackets places number in parenthisis
        // zero returns nothing for a zero count
        var plural = word+"s";
        if(word === "Reply"){
            var plural = "Replies"; 
        }
        
        if(count === 0 && zero){ return null; }
        if(count > 1 || count === 0){
           
            if(brackets){
                return "("+count+") "+plural;
            }
            return count +" " +plural
        }
        if(brackets){
            return "("+count+") "+word;
        }
        return count+ " " +word;
      
    };
});

angular.module('system').filter('chopcate', function () {
    return function (value, wordwise, max, tail) {
        if (!value)
            return '';

        max = parseInt(max, 10);
        if (!max)
            return value;
        if (value.length <= max)
            return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});
      
      
angular.module('system')
        .filter('truncate', function () {
    return function (text, length, end) {
        
        if (isNaN(length))
            length = 10;

        if (end === undefined)
            end = "...";

        if (text.length <= length || text.length - end.length <= length) {
            return text;
        }
        else {
            return String(text).substring(0, length - end.length) + end;
        }
    };
})
.filter('capitalize', function() {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    };
});