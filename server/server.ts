/// <reference path="typings/tsd.d.ts" />

import express = require('express')
import http = require('http')
import mkdirp = require('mkdirp')
import bodyParser = require('body-parser')
import fs = require('fs')
import path = require('path')
import SocketIO = require('socket.io')
import manager from './manager'
import Download from './manager/Download'
import MediaTitleParser from './reader'

var app = express()
var server = http.createServer(app)
var io = SocketIO(server)

app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', express.static(__dirname + '/../client'))

/**
 * API
 */
import apiDownload = require('./api/download')
app.use('/api', apiDownload.router)

io.on('connection', function (socket) {
    
    //--## Socket Router
    apiDownload.socketRouter.route(socket)
    //--## Socket Router END
    
    socket.once('disconnect', function () {
        socket.removeAllListeners()
    })
    
})

var filmDir = '/Volumes/Qmultimedia/Films'
var serieDir = '/Volumes/Qmultimedia/Séries TV'

manager.on('new', (download: Download) => {
    console.log('new download event', download.name)
    var destDir
    var serie = MediaTitleParser.parse(download.name)
    console.log(serie)
    if (serie) {
        destDir = path.join(serieDir, serie.title, 'Saison ' + serie.saison)
        console.log(destDir)
    } else {
        destDir = path.join(filmDir, download.package())
    }
    try {
        console.log(mkdirp.sync(destDir))
    } catch (e) {
        console.log(e)
    }
    
    var stream = fs.createWriteStream(path.join(destDir, download.name))
    console.log(download.name)
    download.pipe(stream)
})

server.listen(3000, function () {
    console.log('API Started')
})