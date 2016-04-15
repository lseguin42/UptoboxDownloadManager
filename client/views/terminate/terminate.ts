/// <reference path="../../typings/tsd.d.ts" />

angular.module('downloadManagerApp')
    .config(function ($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('terminate', {
            url: '/downloads/terminate',
            templateUrl: '/views/terminate/terminate.html',
            controller: 'TerminateCtrl',
            controllerAs: 'vm'
        })
    })