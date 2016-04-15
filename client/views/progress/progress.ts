/// <reference path="../../typings/tsd.d.ts" />

angular.module('downloadManagerApp')
    .config(function ($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('progress', {
            url: '/downloads/progress',
            templateUrl: '/views/progress/progress.html',
            controller: 'ProgressCtrl',
            controllerAs: 'vm'
        })
    })