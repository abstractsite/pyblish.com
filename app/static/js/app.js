"use strict";
/*global angular*/
/*global hljs*/

(function () {

    var app = angular.module("pyblishApp", ["ngRoute",
                                            "ui.utils",
                                            "ui.bootstrap",
                                            "duScroll"]);

    app.config(function ($routeProvider, $locationProvider, $anchorScrollProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "static/views/home.html"
            })
            .when("/kits", {
                templateUrl: "static/views/kits.html"
            })
            .when("/pricing", {
                templateUrl: "static/views/pricing.html"
            })
            .when("/guide", {
                templateUrl: "static/views/guide.html"
            })
            .otherwise("/");

        $locationProvider.html5Mode(true);
        $anchorScrollProvider.disableAutoScrolling();
    });

}());