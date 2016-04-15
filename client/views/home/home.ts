/// <reference path="../../typings/tsd.d.ts" />

angular.module('downloadManagerApp')
    .config(function ($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'views/home/home.html',
            controller: 'HomeCtrl',
            controllerAs: 'vm'
        })
    })