/// <reference path="../../typings/tsd.d.ts" />

angular.module('downloadManagerApp')
    .config(function ($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('incoming', {
            url: '/downloads/incoming',
            templateUrl: '/views/incoming/incoming.html',
            controller: 'IncomingCtrl',
            controllerAs: 'vm'
        })
    })