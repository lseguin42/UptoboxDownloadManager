/// <reference path="../../typings/tsd.d.ts" />

angular.module('downloadManagerApp')
    .controller('ProgressCtrl', function (DownloadManager: DownloadManagerService) {
        var self = this;
        self.manager = DownloadManager
    })