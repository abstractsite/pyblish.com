"use strict";
/*global angular*/
/*global hljs*/

(function () {

    var app = angular.module("pyblishApp", ["ngRoute",
                                            "ui.utils",
                                            "ui.bootstrap",
                                            "restangular"]);

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
                redirectTo: "/guide/overview"
            })
            .when("/guide/:view", {
                templateUrl: "static/views/guide.html",
                controller: "guideController",
                controllerAs: "ctrl"
            })
            .when("/404", {
                templateUrl: "static/views/404.html"
            })
            .otherwise({
                redirectTo: "/404"
            });

        $locationProvider.html5Mode(true);
    });


    app.controller("guideController", function ($sce, $location, Restangular) {
        var self,
            guide,
            path;

        self = this;
        path = $location.path()
               .slice(1) // Remove prefix "/"
               .toLowerCase();

        guide = Restangular.one("view/" + path);

        guide.get().then(function (data) {

            /* Trust the HTML */
            self.html = $sce.trustAsHtml(data.html);
            self.title = data.title;
            self.next = data.next;
            self.previous = data.previous;

            self.toc = data.toc;
        });

        self.showNavigation = false;
        self.showSidebar = true;
    });

}());