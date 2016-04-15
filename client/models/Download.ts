/// <reference path="./Progressor.ts" />

class Progressor {
    
    protected _size: number = 0
    protected _recv: number = 0
    protected _speed: number = 0
    protected _pourcent: number = 0
    private _lastUpdate: number = -1
    
    protected _setSize(size: number) {
        this._size = size
        this._updatePourcent()
    }
    
    protected _addSize(size: number) {
        this._size += size
    }
    
    protected _addRecv(recv: number) {
        this._recv += recv
        this._updateSpeed(recv)
    }
    
    protected _setRecv(recv: number) {
        var diff = recv - this._recv
        this._recv = recv
        this._updateSpeed(diff)
    }
    
    private _updateSpeed(bytes: number) {
        var now = Date.now()
        var secondes = (now - this._lastUpdate) / 1000
        this._speed = bytes / secondes
        this._updatePourcent()
        this._lastUpdate = now
    }
    
    private _updatePourcent() {
        this._pourcent = this._recv / this._size
    }
    
}

class Download extends Progressor implements IDownload {
    id: string
    status: string
    name: string
    link: string
    
    private DownloadManager: DownloadManagerService
    
    constructor(data: IDownload) {
        super()
        for (var attr in data)
            this[attr] = data[attr]
    }
    
    get recv() {
        return this._recv
    }
    
    set recv(value: number) {
        var diff = value - this._recv
        this._addRecv(diff)
    }
    
    get size() {
        return this._size
    }
    
    set size(size: number) {
        this._setSize(size)
    }
    
    get speed() {
        return this._speed
    }
    
    get pourcent() {
        return this._pourcent
    }
}
