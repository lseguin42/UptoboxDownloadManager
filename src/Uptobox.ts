import { Debrid } from './Debrid'
import { Hoster } from './Hoster'
import { Cookie } from './Cookie'
import request = require('request')
import Q = require('q')
import path = require('path')
import url = require('url')

export class Uptobox extends Hoster {
    
    connect(): Q.Promise<any> {
        if (this.connexionIsReady)
            return this.connexionIsReady
        var deferred = Q.defer()
        
        request.post('https://login.uptobox.com/logaritme', {
            'form': {
                'login': this.username,
                'password': this.password,
                'op': 'login'
            }
        }, (err, res, body) => {
            if (err)
                return deferred.reject(err)
            this.cookies = [];
            if (!res || !res.headers || !res.headers['set-cookie'])
                return deferred.reject(new Error('headers error')); 
            var setcookies = res.headers['set-cookie'];
            if (typeof setcookies === 'string')
                setcookies = [setcookies]
            for (var i = 0; i < setcookies.length; i++) {
                var setcookie = setcookies[i]
                var cookie = setcookie.split(';')[0].split('=')
                this.cookies.push(new Cookie(cookie[0], cookie[1]))
            }
            if (Cookie.have(this.cookies, 'xfss'))
                deferred.resolve()
            else {
                this.isBanned = true
                deferred.reject(new Error('login error'))
            }
        })
        return this.connexionIsReady = deferred.promise
    }
    
    debrid(link: string): Q.Promise<Debrid> {
        var deferred = Q.defer<Debrid>()
        var nbRetry = 1
        var onConnexionReady
        this.connexionIsReady.then(onConnexionReady = () => {
            request.head(link, {
                headers: {
                    'Cookie': this.cookiesFormat()
                }
            }, (err, out) => {
                var res: any = out;
                if (res.headers['set-cookie']) {
                    if (nbRetry-- > 0)
                        return this.reconnect().then(onConnexionReady, function (err) {
                            deferred.reject(err)
                        })
                    return deferred.reject(new Error('not logged'))
                } else if (res.headers['content-type'] !== 'application/octet-stream') {
                    return deferred.reject(new Error('bad link'))
                }
                deferred.resolve(new Debrid(
                    path.basename(url.parse(res.request.href).pathname),
                    parseInt(res.headers['content-length']),
                    res.request.href,
                    this.cookiesFormat()
                ))
            })
        }, function (err) {
            deferred.reject(err)
        })
        return deferred.promise
    }
    
}