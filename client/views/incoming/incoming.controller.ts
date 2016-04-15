/// <reference path="../../typings/tsd.d.ts" />

angular.module('downloadManagerApp')
    .controller('IncomingCtrl', function (DownloadManager: DownloadManagerService) {
        var self = this;
        self.manager = DownloadManager
    })