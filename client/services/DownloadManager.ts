/// <reference path="../typings/tsd.d.ts" />

class DownloadManagerService {
    
    public downloads: Array<Download> = []
    private _sync: boolean = false 
    
    constructor(private Socket: SocketService) {
        this.sync()
    }
    
    get pourcent() {
        return this.recvBytes / this.totalBytes
    }
    
    get recvBytes() {
        var bytes = 0
        this.downloads.forEach((download) => {
            bytes += download.recv
        })
        return bytes
    }
    
    get totalBytes() {
        var bytes = 0
        this.downloads.forEach((download) => {
            bytes += download.size
        })
        return bytes
    }
    
    get speed() {
        var bytes = 0
        this.downloads.filter((download) => download.status === 'progress')
        .forEach((download) => {
            bytes += download.speed
        })
        return bytes
    }
    
    private register(download: Download) {
        this.Socket.emit('download:register', download.id)
        this.Socket.on('download:' + download.id + ':update', (update: IDownloadUpdate) => {
            for (var attr in update)
                download[attr] = update[attr]
            console.log(update);
        })
    }
    
    private unregister(download: Download) {
        this.Socket.emit('download:' + download.id + ':unregister')
        this.Socket.removeListener('download:' + download.id + ':update')
    }
    
    isSync() {
        return this._sync
    }
    
    sync() {
        if (this._sync)
            return ;
        this._sync = true
        this.Socket.on('download:new', (data: IDownload) => {
            var download = new Download(data)
            this.register(download)
            this.downloads.push(download)
        })
        this.Socket.emit('download:register')
    }
    
    unsync() {
        this.downloads.forEach((download) => this.unregister(download))
        this.Socket.removeListener('download:new')
        this.Socket.emit('download:unregister')
        this._sync = false
    }
  
}

angular.module('downloadManagerApp')
    .service('DownloadManager', DownloadManagerService)