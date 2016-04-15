/// <reference path="../typings/tsd.d.ts" />

import { Cookie } from './Cookie'
import { Debrid } from './Debrid'
import request = require('request')
import Q = require('q')

export abstract class Hoster {
    protected username: string;
    protected password: string;
    protected connexionIsReady: Q.Promise<any>;
    protected isBanned: boolean;
    protected cookies: Array<Cookie>;
    
    constructor(username: string, password: string) {
        this.username = username
        this.password = password
        this.cookies = []
        this.connexionIsReady = null
        this.isBanned = false
        this.connect()
    }
    
    getUsername(): string {
        return this.username
    }
    
    cookiesFormat(): string {
        var res = ''
        for (var i = 0; i < this.cookies.length; i++) {
            var cookie = this.cookies[i]
            if (i > 0) res += ' '
            res += cookie.toString()
        }
        return res
    }
    
    reconnect(): Q.Promise<any> {
        if (!this.connexionIsReady.isPending()) {
            this.connexionIsReady = null
            this.cookies = []
            return this.connect()
        }
        return this.connexionIsReady
    }

    download(link: string, bytes: number = 0): Q.Promise<request.Request> {
        var deferred = Q.defer<request.Request>()
        this.debrid(link).then((debrid) => {
            var headers = {
                'Cookie': debrid.cookies
            }
            if (bytes > 0)
                headers['Range'] = 'bytes=' + bytes + '-'
            var req = request.get(debrid.download, {
                headers: headers
            });
            deferred.resolve(req)
        }, () => {
            deferred.reject(new Error('debrid fail'));
        });
        return deferred.promise
    }
   
    abstract connect(): Q.Promise<any>;
    
    abstract debrid(link: string): Q.Promise<Debrid>;
}