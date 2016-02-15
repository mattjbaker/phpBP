/* 
 * Created by Matt Baker 2015
 * 
 * 
 */

angular.module('docs')
.directive('popOer',function(){
    return{
        restrict:'A',
        link:function(scope,elem,attrs){
            $(elem).popover({
                trigger: 'hover',
                html: true,
                content: attrs.popoverHtml,
                placement: attrs.popoverPlacement
            });
        }
    };
}).directive('linker',function(){
    return{
        link:function(scope,elem,attrs){
            var link = "."+attrs.link;
            $(elem).hover(function(){
                $(this).closest('tr').css('color','red');
                $(link).css('color','red');
            },function(){
                $(this).closest('tr').css('color','black');
                $(link).css('color','black');
            });
        }
              
    };
});