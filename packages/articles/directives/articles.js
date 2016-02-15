/* 
* Created by Matt Baker 2015
* 
*/
'use strict';

angular.module('articles')

.directive('scrollMorph', function () {
    return {
        link: function (scope, elem, attr) {

            var go = function () {
                if (($(elem).offset().top > ($(window).scrollTop() + 155))) {
                    $(elem).find('div .yy-square').addClass('yy-hover-out')
                            .removeClass('yy-hover-in');
                } else {
                    $(elem).find('div .yy-square').addClass('yy-hover-in')
                            .removeClass('yy-hover-out');
                }
            };
            $(window).scroll(function () {
                go();
            });
            go();
        }
    };
})

.directive('hoverMorph', function () {
    return{
        link: function (scope, elem, attr) {
            $(elem).hover(function () {
                $(elem).find('div .yy-square').addClass('yy-hover-in')
                        .removeClass('yy-hover-out');
            }, function () {
                $(elem).find('div .yy-square').addClass('yy-hover-out')
                        .removeClass('yy-hover-in');

            });
        }
    };
})

.directive('articlesView', function () {
    return{
        restrict: 'EA',
        templateUrl: 'packages/articles/view/articles-view.html'
    };
})

.directive('articlesHeadline', function () {
    return{
        transclude: true,
        templateUrl: 'articles-headline'
    };
})

.directive('articlesMini', function () {
    return{
        restrict: 'EA',
        templateUrl: 'packages/articles/view/articles-view.html'
    };
});