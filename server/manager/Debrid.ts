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