/// <reference path="../typings/q/Q.d.ts" />
/// <reference path="../typings/request/request.d.ts" />

import { Cookie } from './Cookie'
import { Debrid, FileDebrid } from './Debrid'
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

    download(link: string): Q.Promise<FileDebrid> {
        var deferred = Q.defer<FileDebrid>()
        this.debrid(link).then((debrid) => {
            var fd = new FileDebrid(debrid.filename, debrid.size);
            request.get(debrid.download, {
                headers: {
                    'Cookie': debrid.cookies
                }
            }).pipe(fd);
            deferred.resolve(fd)
        }, () => {
            deferred.reject(new Error('debrid fail'));
        });
        return deferred.promise
    }
   
    abstract connect(): Q.Promise<any>;
    
    abstract debrid(link: string): Q.Promise<Debrid>;
}