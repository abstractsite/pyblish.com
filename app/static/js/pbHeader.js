"use strict";
/*global angular*/


(function () {

    var app = angular.module("pyblishApp");

    app.directive("pbHeader", function () {
        return {
            restrict: "E",
            templateUrl: "static/templates/pbHeader.html"
        };
    });
}());