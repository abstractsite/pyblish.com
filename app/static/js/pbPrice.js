"use strict";
/*global angular*/


(function () {

    var app = angular.module("pyblishApp"),
        types = {
            free: {
                title: "Free",
                location: "Forever",
                description: "Start building your pipeline today. Perfect for the developer with a lust for full control.",
                features: ["Open Source",
                           "Cross-platform",
                           "Integration API"]
            },
            kit: {
                title: "Kit",
                location: "License",
                description: "Get up and running quickly with pre-packaged, fully documented and tested workflow kits.",
                features: ["Pre-built",
                           "Documented/tested",
                           "Community support"]
            },
            tailored: {
                title: "Tailored",
                location: "On-premise",
                description: "Tailor a pipeline to suit your exact needs, no compromise, full support.",
                features: ["Requirements gathering",
                           "Custom implementation",
                           "Support",
                           "1-4 weeks"]
            },
            bespoke: {
                title: "Bespoke",
                location: "On-premise",
                description: "Got something else on your mind? Let's talk.",
                features: ["1-4 months"]
            }
        };

    app.directive("pbPrice", function () {

        return {
            restrict: "E",
            controller: function ($scope) {
                this.title = types[$scope.type].title;
                this.location = types[$scope.type].location;
                this.description = types[$scope.type].description;
                this.features = types[$scope.type].features;
            },
            controllerAs: "ctrl",
            templateUrl: "static/templates/pbPrice.html",
            scope: {
                type: "@"
            }
        };
    });

}());