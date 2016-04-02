export class Cookie {
    private name: string;
    private value: string;
    
    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }
    
    toString(): string {
        return this.name + '=' + this.value + ';';
    }
    
    static have(cookies: Array<Cookie>, name: string): boolean {
        for (var i = 0; i < cookies.length; i++) {
            if (cookies[i].name === name)
                return true
        }
        return false
    }
}