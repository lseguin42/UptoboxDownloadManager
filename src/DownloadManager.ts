/// <reference path="../typings/async/async.d.ts" />
/// <reference path="../typings/q/Q.d.ts" />

import { Hoster } from './Hoster'
import fs = require('fs')
import path = require('path')

interface IDownload {
    dest: string;
    link: string;
    name: string;
    size: number;
    recv: number;
}

function formatSize(bytes: number): string {
    var units = ['octects', 'Ko', 'Mo', 'Go', 'To', 'Po']
    var i = 0
    while (bytes > 1000 && i < units.length) {
        bytes /= 1000;
        i++
    }
    return bytes.toFixed(2) + units[i]
}

function formatProgress(download: IDownload) {
    return ' [' + formatSize(download.recv) + ' / ' + formatSize(download.size) + ']'
            + '[' + ((download.recv / download.size) * 100).toFixed(2) + ' %]'
}

export class DownloadManager {
    
    private terminateList: Array<IDownload> = []
    private progressList: Array<IDownload> = []
    private taskList: Array<IDownload> = []
    private hoster: Hoster
    private limit: number
    private current: number
    
    constructor(hoster: Hoster, limit: number = 1) {
        this.hoster = hoster
        this.limit = limit
        this.current = 0;
    }
    
    download(link: string, dest: string) {
        this.hoster.debrid(link).then((metadata) => {
            this.taskList.push({
                dest: dest,
                link: link,
                name: metadata.filename,
                size: metadata.size,
                recv: 0
            });
            this.next();
        })
    }
    
    display() {
        if (this.taskList.length > 0)
            console.log('========== TASKS ==========')
        this.taskList.forEach((download) => {
            console.log(download.name + ' [' + formatSize(download.size) + ']')
        })
        if (this.progressList.length > 0)
            console.log('======= DOWNLOADING =======')
        this.progressList.forEach((download) => {
            console.log(download.name + formatProgress(download))
        })
        if (this.terminateList.length > 0)
            console.log('======== TERMINATE ========')
        this.terminateList.forEach((download) => {
            var error = (download.recv != download.size ? ' [Error]' + formatProgress(download)  : '')
            console.log(download.name + error)
        })
    }
    
    private downloading(download: IDownload, finish: Function): void {
        this.hoster.download(download.link).then((file) => {
            this.progressList.push(download)
            file.pipe(fs.createWriteStream(path.join(download.dest, file.name)))
            file.on('data', (chunk) => {
                download.recv += chunk.length
            })
            file.on('end', () => {
                this.progressList.splice(this.progressList.indexOf(download), 1)
                this.terminateList.push(download)
                finish()
            })
        }, () => {
            finish()
        });
    }
    
    private next() {
        if (this.current >= this.limit || this.taskList.length == 0)
            return ;
        var download = this.taskList.shift()
        this.downloading(download, () => {
            process.nextTick(() => {
                this.current -= 1
                this.next()
            })
        })
        this.current += 1
    }

}