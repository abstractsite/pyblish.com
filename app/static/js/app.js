"use strict";
/*global angular*/
/*global hljs*/

(function () {

    var app = angular.module("pyblishApp", ["ngRoute",
                                            "ui.utils",
                                            "ui.bootstrap",
                                            "restangular"]);

    app.run(function ($rootScope, $location, $anchorScroll) {
        $rootScope.scrollTo = function (id) {
            var old = $location.hash();

            $location.hash(id);
            $anchorScroll();
            $location.hash(old);
        };
    });

    app.filter('titlecase', function () {
        return function (s) {
            s = (s === undefined || s === null) ? '' : s;
            return s.toString().toLowerCase().replace(/\b([a-z])/g, function (ch) {
                return ch.toUpperCase();
            });
        };
    });

    app.config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "static/views/home.html",
                controller: "homeController",
                controllerAs: "ctrl"
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

    app.controller("homeController", function ($sce) {
        var self;

        self = this;

        self.showPlayer = false;
        self.playerUrl = $sce.trustAsResourceUrl("https://player.vimeo.com/video/117184207");

        self._companies = {
            realise: {
                name: "Realise Studio",
                logo: "static/img/companies/realise.png",
                link: "http://www.realisestudio.com/",
                employees: "10-20"
            },
            caoz: {
                name: "CAOZ",
                logo: "static/img/companies/caoz.png",
                link: "http://www.caoz.com",
                employees: "50-80",
            },
            colorbleed: {
                name: "Colorbleed",
                logo: "static/img/companies/colorbleed.png",
                link: "http://www.colorbleed.nl",
                employees: "2-15",
            },
            bait: {
                name: "Bait Studio",
                logo: "static/img/companies/bait.png",
                link: "http://www.baitstudio.com/",
                employees: "10-20",
            },
            ttgames: {
                name: "Traveller's Tales Games",
                logo: "static/img/companies/ttgames.png",
                link: "http://www.ttgames.com/",
                employees: "200-300",
            },
            filmgate: {
                name: "Filmgate",
                logo: "static/img/companies/filmgate.png",
                employees: "2-15",
            },
            kredenc: {
                name: "Kredenc",
                logo: "static/img/companies/kredenc.png",
                link: "http://www.kredenc.org",
                employees: "2-15",
            },
        };

        self.companies = [
            {src: "static/img/companies/realise.png", height: 30},
            {src: "static/img/companies/caoz.png", height: 30},
            {src: "static/img/companies/colorbleed.png", height: 40},
            {src: "static/img/companies/bait.png", height: 30},
            {src: "static/img/companies/ttgames.png", height: 60},
            {src: "static/img/companies/filmgate.png", height: 30},
            {src: "static/img/companies/kredenc.png", height: 60},
        ];
        self.software = [
            {src: "static/img/software/maya.png", height: 50, tooltip: "Autodesk Maya"},
            {src: "static/img/software/softimage.png", height: 50, tooltip: "Autodesk Softimage"},
            {src: "static/img/software/3dsmax.png", height: 50, tooltip: "Autodesk 3ds Max"},
            {src: "static/img/software/nuke.png", height: 50, tooltip: "The Foundry Nuke"},
            {src: "static/img/software/modo.png", height: 50, tooltip: "The Foundry Modo"},
            {src: "static/img/software/clarisse.png", height: 25, tooltip: "Isotropix Clarisse"},
            {src: "static/img/software/houdini.png", height: 50, tooltip: "SideFx Houdini"},
            {src: "static/img/software/ftrack.png", height: 50, tooltip: "Ftrack"},
            {src: "static/img/software/shotgun.png", height: 25, tooltip: "Shotgun"},
        ];
        self.stories = [
            {
                name: "David Martinez",
                story: "Pyblish is awesome",
                company: self._companies.ttgames,
            },
            {
                name: "Lars van der Byl",
                story: "We submit everything using Pyblish.",
                company: self._companies.realise,
            },
            {
                name: "Toke Jepsen",
                story: "Pyblish is awesome",
                company: self._companies.bait,
            },
            {
                name: "Sveinbjörn J. Tryggvason",
                story: "We use Pyblish with Softimage and built a bespoke \
                       frontend based on our particular needs, the intuitive and \
                       well defined API was of big help here.",
                company: self._companies.caoz,
            },
            {
                name: "Milan Kolar",
                story: "I'm boarding this ship!",
                company: self._companies.kredenc,
            },
            {
                name: "Roy Nieterau",
                story: "Pyblish is awesome! And this is a very very long comment, really loooong!",
                company: self._companies.colorbleed,
            },
        ];
    });

}());