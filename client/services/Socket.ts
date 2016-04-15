/// <reference path="../typings/tsd.d.ts" />

class SocketService {
    
    private _socket: SocketIOClient.Socket
    private _ready: ng.IPromise<any>
    
    constructor(private $rootScope: ng.IRootScopeService) {
        this._socket = io.connect()
        this._socket.on('connect', () => {
            console.log('Socket.IO Connection Event')
        })
    }
    
    emit(...args: any[]) {
        var last = args[args.length - 1]
        if (typeof last === 'function') {
            args[args.length - 1] = (...argsAcks: any[]) => {
                this.$rootScope.$apply(() => {
                    (<Function>last).apply(this, argsAcks)
                })
            }   
        }
        this._socket.emit.apply(this._socket, args)
        return this
    }
    
    on(ev: string, fn: Function) {
        this._socket.on(ev, (...args: any[]) => {
            this.$rootScope.$apply(() => {
                fn.apply(this, args)
            })
        })
        return this
    }
    
    removeListener(ev: string) {
        this._socket.removeListener(ev)
        return this
    }
    
    removeAllListener() {
        this._socket.removeAllListeners()
        return this
    }
}

angular.module('downloadManagerApp')
    .service('Socket', SocketService)