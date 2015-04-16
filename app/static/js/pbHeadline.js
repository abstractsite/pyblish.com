"use strict";
/*global angular*/


(function () {

    var app = angular.module("pyblishApp");

    app.directive("pbHeadline", function () {
        return {
            restrict: "E",
            templateUrl: "static/templates/pbHeadline.html",
            scope: {
                title: "@",
                text: "@",
                subtitle: "@"
            },
            transclude: true
        };
    });
}());