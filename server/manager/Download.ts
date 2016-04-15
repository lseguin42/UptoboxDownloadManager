/// <reference path="../typings/tsd.d.ts" />

import { Hoster } from './Hoster'
import stream = require('stream')
import Q = require('q')
import crypto = require('crypto')
import request = require('request')

export default class Download extends stream.PassThrough implements IDownload {
    
    private _id: string
    
    private _link: string
    private _hoster: Hoster
    private _ready: Q.Promise<any>
    
    private _creationDate: number = -1
    private _startDownloadingDate: number = -1
    private _finishDownloadingDate: number = -1
    private _lastUpdateDate: number = -1
    
    private _recv: number = 0
    private _started: boolean = false
    private _finish: boolean = false
    
    private _name: string
    private _size: number
    
    private _countError: number = 0
    
    private _currentRequest: request.Request = null
    private _abort: boolean = false
    
    
    static filterByStatus(type: string) {
        return (download: Download) => {
            return download.status === type
        }
    }
    
    constructor(hoster: Hoster, link: string) {
        super()
        var deferred = Q.defer<any>()
        
        this._creationDate = Date.now()
        this._lastUpdateDate = this._creationDate
        this._link = link
        this._hoster = hoster
        this._ready = deferred.promise
        this._id = crypto.createHash('md5')
                        .update(this._link + this._creationDate + Math.random())
                        .digest('hex')
        
        this._hoster.debrid(link).then((metadata) => {
            this._name = metadata.filename
            this._size = metadata.size
            deferred.resolve()
        }, (error) => {
            console.log(error)
            deferred.reject(error)
        })
    }
    
    package() {
        var dir = './'
        var res = this.name.match(/^(.+)\.part[0-9]+\.rar$/)
        if (res)
            dir = res[1]
        return dir
    }
    
    end(...args: any[]) {
        this._finish = true
        this._finishDownloadingDate = Date.now()
        return super.end.apply(this, args)
    }
    
    start(): void {
        if (this._started || this._finish)
            throw "Already start or is finish !"
        this._started = true
        if (this._recv === 0)
            this._startDownloadingDate = Date.now()
        this._hoster.download(this._link, this._recv).then((req) => {
            this._currentRequest = req
            req.pipe(this, { end: false })
            req.on('end', () => {
                this._started = false
                this._currentRequest = null
                if (this._recv === this._size || this._abort)
                    this.end()
                this._update(['status', 'recv'])
                this.emit('next')
            })
        })
        this._update(['status'])
    }
    
    abort(): void {
        this._abort = true
        if (this._currentRequest)
            this._currentRequest.abort()
    }
    
    private _update(attrs: Array<string> = ['recv']) {
        let now = Date.now()
        if (attrs.indexOf('status') !== -1 || this._lastUpdateDate + 2000 < now) {
            this._lastUpdateDate = now
            var update: IDownloadUpdate = {}
            attrs.forEach((attr) => {
                update[attr] = this[attr]
            })
            this.emit('update', update)
        }
    }
    
    write(chunk) {
        this._countError = 0
        this._recv += chunk.length
        this._update()
        return super.write.apply(this, arguments)
    }
    
    toJSON(): IDownload {
        return {
            id: this._id,
            status: this.status,
            recv: this._recv,
            size: this._size,
            name: this._name,
            link: this._link
        }
    }
    
    get status() {
        if (this._started)
            return 'progress'
        if (this._finish)
            return 'terminate'
        return 'incoming'
    }
    
    get id() {
        return this._id
    }
    
    get isReady() {
        return this._ready
    }
    get link() {
        return this._link
    }
    get name() {
        return this._name
    }
    get size() {
        return this._size
    }
    get recv() {
        return this._recv
    }
    
}