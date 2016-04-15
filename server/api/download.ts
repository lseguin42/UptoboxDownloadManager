/// <reference path="../typings/tsd.d.ts" />

import express = require('express')
import { SocketRouter, ProxySocket } from '../socket'
import manager from '../manager'
import Download from '../manager/Download'
import fs = require('fs')

export var router = express.Router()

/**
 * Ajouter un nouveau download
 */
router.put('/download', function (req, res) {
    if (!req.body.link)
        return res.sendStatus(500)
    var download = manager.download(req.body.link)
    download.isReady.then(() => {
        res.end('ready')
        console.log('download is ready')
    }, (e) => {
        res.sendStatus(500)
    })
})

/**
 * Return all download list
 */
router.get('/download', function (req, res) {
    res.json(manager.getDownloads())
})

/**
 * Information on specific download
 */
router.get('/download/:id([a-fA-F0-9]{32})', function (req, res) {
    let download = manager.getDownloadById(req.params.id)
    if (!download)
        return res.sendStatus(404)
    res.json(download)
})

/**
 * 
 */
export var socketRouter = new SocketRouter('download')

var defaultRegister = function() {
    var self: ProxySocket = this
    var listenerDownloadNew
    
    manager.on('new',  listenerDownloadNew = (download: Download) => {
        self.emit('new', download)
    })
    manager.getDownloads().forEach(listenerDownloadNew)
    
    self.on('unregister', () => {
        manager.removeListener('new', listenerDownloadNew)
    })
}

socketRouter.on('register', function (id) {
    if (!id) return defaultRegister.call(this)
    var self: ProxySocket = this
    var listenerChangeDownload
    
    let download = manager.getDownloadById(id)
    if (!download)
        throw "download not found";
    self.emit('update', download)
    
    download.on('update', listenerChangeDownload = (update: IDownloadUpdate) => {
        self.emit('update', update)
    })
    
    self.on('abort', () => {
        download.abort()
    })
    
    self.on('unregister', () => {
        download.removeListener('update', listenerChangeDownload)
    })
})