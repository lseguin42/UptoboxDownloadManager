/// <reference path="typings/tsd.d.ts" />

export interface ProxySocket {
    on(name: string, fn: Function)
    emit(name: string, ...args: any[])
}

export class SocketRouter {
    
    name: string
    events: Array<{name: string, fn: Function}> = []
    
    constructor(route: string) {
        this.name = route
    }
    
    on(ev: string, fn: Function) {
        this.events.push({name: ev, fn: fn})
    }
    
    route(socket: SocketIO.Socket) {
        this.events.forEach((event) => {
            socket.on(this.name + ':' + event.name, (id) => {
                var storeEvent = new Array<{name: string, fn: Function}>()
                var prefix = this.name + (id ? ':' + id : '') + ':'
                
                var proxySocket: ProxySocket = {
                    on: (name: string, fn: Function) => {
                        var evSocketName = prefix + name
                        socket.on(evSocketName, fn)
                        storeEvent.push({ name: name, fn: fn })
                        return proxySocket
                    },
                    emit: (name: string, ...args: any[]) => {
                        args.unshift(prefix + name)
                        socket.emit.apply(socket, args)
                        return proxySocket
                    }
                }
                
                socket.once(prefix + ':unregister', () => {
                    storeEvent.forEach((ev) => {
                        socket.removeListener(prefix + ev.name, ev.fn)
                    })
                })
                
                socket.on('disconnect', () => {
                    storeEvent.forEach((ev) => {
                        if (ev.name === 'unregister')
                            ev.fn()
                    })
                })
                
                event.fn.call(proxySocket, id)
            })
        })
        
    }
   
}