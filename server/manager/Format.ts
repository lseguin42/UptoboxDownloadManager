export default class Format {
    
    static digit(value: number) {
        return (value < 10 ? "0" + value : value + "")
    }

    static time(seconds: number, format: string = 'HH:MM:SS') {
        var hours = Math.floor(seconds / 3600)
        seconds -= hours * 3600
        var minutes = Math.floor(seconds / 60)
        seconds -= minutes * 60
        var seconds = seconds
        return Format.digit(hours)
                + ":" + Format.digit(minutes)
                + ":" + Format.digit(seconds)
    }
    
}