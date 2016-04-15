/// <reference path="../../typings/tsd.d.ts" />

angular.module('downloadManagerApp')
    .filter('downloadFilterByStatus', () => {
        return function (downloads: Array<Download>, status: string) {
            return downloads.filter((download) => {
                return download.status === status
            })
        }
    })
    .filter('bytes', () => {
        return function (bytes: number, precision: number = 2) {
            let units = [ 'octects', 'Ko', 'Mo', 'Go', 'To', 'Po' ]
            for (var i = 0;
                     i < units.length && bytes > 1000;
                     i++, bytes /= 1000)
            {}
            return bytes.toFixed(precision) + units[i]
        }
    })
    .filter('pourcent', () => {
        return function (value: number, precision: number = 2) {
            return (value * 100).toFixed(precision) + '%'
        }
    })