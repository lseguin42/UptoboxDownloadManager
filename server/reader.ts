/// <reference path="typings/node/node.d.ts" />

import querystring = require('querystring')

function cleanTitle(title: string) {
    var listWordNoRequireUpperCase = [ 'of' ]
    title = title.toLowerCase()
                .replace(/[\.]/g, ' ') // Replace '.' to ' '
                .replace(/ \- /g, ' ') // Replace ' - ' to ' '
                .replace(/\s+/g, ' ') // Replace multiple white space to single space
                .replace(/(^|[ -])([a-z])([^ ]*)/g, (match: string, startOrSpace: string, firstLetter: string, endWord: string) => { // Capitalize First Letter
                    if (listWordNoRequireUpperCase.indexOf(firstLetter + endWord) !== -1)
                        return match
                    return startOrSpace + firstLetter.toUpperCase() + endWord
                })
                .replace(/ [1-2][0-9]{3}/, '') // remove year
                .replace(/(^\s+)|(\s+$)/, '') // trim 
    return title
}

function dynamic_cast<T>(Type: { new(): T }, object: Object): T {
    if (!(object instanceof Type))
        return null
    return <T>object
}

class Multimedia {
    title: string
    cover: string
}

class Movie extends Multimedia {}

class Serie extends Multimedia {
    saison: number
    episode: number
}

export default class MediaTitleParser {
    
    static extract(title: string, regexList: RegExp[], fn: Function) {
        for (var i in regexList) {
            let regex = regexList[i]
            let res = title.match(regex)
            if (res)
                return fn(res)
        }
        return null
    }
    
    static extractEpisode(title: string) {
        var episode: {
            title: string,
            saison: number,
            episode: number,
            year: number
        } = null
        this.extract(title, [
            /saison.?([0-9]{1,2}).*\.(rar|zip|tar|tar\.gz)/i,
            /season.?([0-9]{1,2}).*\.(rar|zip|tar|tar\.gz)/i,
            /[^a-z]s([0-9]{2})[^0-9].*\.(rar|zip|tar|tar\.gz)/i
        ], (res) => {
            episode = {
                title: cleanTitle(title.split(res[0])[0]),
                saison: parseInt(res[1]),
                episode: null,
                year: null
            }
        })
        this.extract(title, [
            /[^0-9a-zA-Z][sS]([0-9]{2})[eE]([0-9]{2})/,
            /[^0-9a-zA-Z]([0-9]{1,2})[xX]([0-9]{1,2})/,
            /([0-9]{1,2})[eE]([0-9]{1,2})/,
            /saison.?([0-9]{1,2}).*episode.?([0-9]{1,2})/,
            /season.?([0-9]{1,2}).*episode.?([0-9]{1,2})/,
            /[^0-9a-zA-Z]([0-9]{1,2})[^0-9a-zA-Z]([0-9]{2})[^0-9a-zA-Z]/
        ], (res) => {
            episode = {
                title: cleanTitle(title.split(res[0])[0]),
                saison: parseInt(res[1]),
                episode: parseInt(res[2]),
                year: null
            }
        })
        if (episode)
            episode.year = this.extractYear(title)
        return episode
    }
    
    static extractFilm(title: string) {
        
    }
    
    static extractYear(title: string) {
        return this.extract(title, [
            /[^0-9]([1-2][0-9]{3})[^0-9]/
        ], (res) => {
            return res[1]
        })
    }
    
    static parse(title: string) {
        var episode = this.extractEpisode(title)
        return episode
    }
    
}