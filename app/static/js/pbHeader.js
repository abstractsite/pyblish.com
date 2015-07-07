"use strict";
/*global angular*/


(function () {

    var app = angular.module("pyblishApp");

    app.directive("pbHeader", function () {
        return {
            restrict: "E",
            templateUrl: "static/templates/pbHeader.html",
            controller: "headerController",
            controllerAs: "ctrl"
        };
    });

    app.controller('headerController', function ($scope, $window) {
        var version = $window.navigator.appVersion,
            os = version.indexOf("Win") !== -1 ? {name: "Windows", link: "win"} :
                 version.indexOf("Mac") !== -1 ? {name: "OSX", link: "osx"} :
                 version.indexOf("X11") !== -1 ? {name: "Linux", link: "linux"} :
                 version.indexOf("Linux") !== -1 ? {name: "Linux", link: "linux"} :
                 {name: "Unknown"};

        console.log("OS is", os.name);

        $scope.os = os;
        $scope.headerTranslucent = $window.pageYOffset < 20 ? true : false;

        $window.addEventListener("scroll", function () {
            $scope.$apply(function () {
                $scope.headerTranslucent = $window.pageYOffset < 20 ? true : false;
            });
        });

        $scope.items = [
            {title: "Home", link: "/"},
            {title: "Learn", link: "http://forums.pyblish.com/t/learning-pyblish-by-example"},
            {title: "Pricing", link: "/pricing"},
            {title: "About", link: "https://github.com/pyblish/pyblish/wiki"},
        ];

        $scope.moreitems = [
            {title: "Forums", link: "http://forums.pyblish.com", tooltip: "Go to forums"},
            {title: "Chat", link: "https://gitter.im/pyblish/pyblish", tooltip: "Go to chat"},
            {title: "API", link: "https://github.com/pyblish/pyblish.api/wiki", tooltip: "Go to API documentation"},
            {title: "Source code", link: "https://github.com/pyblish", tooltip: "Dive into the source code"},
        ];
    });
}());