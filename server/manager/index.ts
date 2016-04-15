import { Uptobox } from './Uptobox'
import DownloadManager from './DownloadManager'

const config = require('../config.json')

console.log(config.uptobox.username, config.uptobox.password)

var hoster = new Uptobox(config.uptobox.username, config.uptobox.password)
var manager = new DownloadManager(hoster)

export default manager