import stream = require('stream')

export class FileDebrid extends stream.Transform {
    name: string
    size: number
    
    constructor(name: string, size: number) {
        super()
        this.readable = true
        this.writable = true
        this.name = name;
        this.size = size;
    }
    
    _transform(chunk, enc, cb) {
        this.push(chunk)
        cb()
    }
}

export class Debrid {
    
    public filename: string;
    public size: number;
    public download: string;
    public cookies: string;
    
    constructor(filename: string, size: number, download: string, cookies: string) {
        this.filename = filename;
        this.size = size;
        this.download = download;
        this.cookies = cookies;
    }
    
}