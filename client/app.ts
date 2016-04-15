/// <reference path="typings/tsd.d.ts" />
/// <reference path="../shared/shared.d.ts" />

angular.module('downloadManagerApp', [
    'ui.router',
    'ngMaterial'
])
// Master Controller
.controller('AppCtrl', function ($state: ng.ui.IStateService) {
    var self = this;
    
    self.menus = [
        { title: 'Incoming', icon: 'menu', state: 'incoming' },
        { title: 'Progress', icon: '', state: 'progress' },
        { title: 'Terminate', icon: '', state: 'terminate' }
    ];
    self.performAction = performAction;
    
    /**
     * eventHello
     */
    function performAction(state) {
        $state.go(state)
    }
})
.config(['$locationProvider', ($locationProvider: ng.ILocationProvider) => {
     $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
     })
}])
.run(['$rootScope', '$state',
            ($rootScope: ng.IRootScopeService,
             $state: ng.ui.IState) => {
     console.log('run')
}])