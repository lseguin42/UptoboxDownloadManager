/// <reference path="../../typings/tsd.d.ts" />

angular.module('downloadManagerApp')
    .controller('HomeCtrl', function ($http: ng.IHttpService, DownloadManager: DownloadManagerService) {
        console.log('HomeCtrl', this)
        let regexUptobox = /((https?:\/\/)?(www.)?uptobox.com\/[a-zA-Z0-9]+)/g
        
        this.area = ""
        this.links = []
        
        this.manager = DownloadManager
        
        
        this.areaChange = () => {
            this.links = this.area.match(regexUptobox) || []
        }
        
        this.submit = () => {
            for (var i in this.links) {
                $http.put('/api/download', 'link=' + this.links[i], {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
            }
            this.area = ""
            this.links = []
        }
        
        
    })