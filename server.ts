import { Uptobox } from './src/Uptobox'
import { DownloadManager } from './src/DownloadManager'

var account = require('./account.json')

var hoster = new Uptobox(account.username, account.password)
var manager = new DownloadManager(hoster)

/**
"http://uptobox.com/8v70zd4nxayu",
"http://uptobox.com/xwkk5416jht4",
"http://uptobox.com/0pei48zc61kl",
"http://uptobox.com/q7lgkttron76"
 */

var downloadList = [
    "http://uptobox.com/i60hif9j4g4g"
]

for (var i in downloadList) {
    manager.download(downloadList[i], '/Volumes/Qmultimedia/Films');
}

setInterval(function () {
    manager.display()
}, 1000)