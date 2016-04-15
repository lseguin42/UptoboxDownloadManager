/// <reference path="../typings/tsd.d.ts" />

import { Hoster } from './Hoster'
import { EventEmitter } from 'events'
import Q = require('q')
import Download from './Download'
import Progress from './Progress'

export default class DownloadManager extends EventEmitter {
    
    private downloads: Array<Download> = []
    
    private hoster: Hoster
    private limit: number
    private current: number
    private update: NodeJS.Timer = null
    private progress: Progress
    
    constructor(hoster: Hoster, limit: number = 3) {
        super()
        this.hoster = hoster
        this.limit = limit
        this.current = 0
        this.progress = new Progress(0, {
            layout: '[%size / %total] [%speed] [%time]\n[%bar] %pourcent\n',
            bar: {
                size: 50,
                complete: '=',
                empty: '.'
            }
        })
    }
    
    download(link: string) {
        var download = new Download(this.hoster, link)
        download.isReady.then(() => {
            console.log('download is ready 2')
            this.downloads.push(download)
            this.emit('new', download)
            
            this.next()
        })
        return download
    }
    
    getDownloadById(id: string): Download {
        for (var i in this.downloads) {
            if (this.downloads[i].id === id)
                return this.downloads[i]
        }
        return null
    }
    
    getProgress() {
        var sizeTotal = 0, sizeRecv = 0
        this.downloads.forEach((download) => {
            sizeRecv += download.recv
            sizeTotal += download.size
        })
        this.progress.setTotal(sizeTotal)
        this.progress.setSize(sizeRecv)
        return this.progress
    }
    
    getStats() {
        return {
            progress: this.getProgress(),
            incomingList: this.getDownloads('incoming').length,
            progressList: this.getDownloads('progress').length,
            terminateList: this.getDownloads('terminate').length
        }
    }
    
    getDownloads(type?: string) {
        return (type ? this.downloads.filter(Download.filterByStatus(type)) : this.downloads)
    }
    
    private downloading(download: Download): void {
        download.start()
        download.on('next', () => this.next())
    }
    
    private next() {
        if (this.getDownloads('progress').length >= this.limit)
            return ;
        var incomingList = this.getDownloads('incoming')
        if (incomingList.length == 0)
            return ;
        this.downloading(incomingList.shift())
    }

}