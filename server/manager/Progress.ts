import Format from './Format'

interface ProgressOption {
    layout?: string,
    bar?: {
        complete?: string,
        empty?: string,
        size?: number
    } 
    time?: string,
    units?: Array<string>
    unitsCoef?: number
}

export default class Progress {
    public size: number = 0
    public total: number = 0
    public lastDate: number = null
    public speed: number = 0
    
    private _layout: string
    
    private _timeFormat: string
    
    private _bar: {
        complete: string,
        empty: string,
        size: number
    }
    
    private _units: Array<string>
    private _coef: number
    
    constructor(total: number = 0, options: ProgressOption = {}) {
        this.total = total
        this.lastDate = Date.now()
        this._layout = options.layout || '[%bar] (%pourcent)'
        
        var bar = options.bar || {}
        this._bar = {
            complete: bar.complete && bar.complete[0] || '=',
            empty: bar.empty && bar.empty[0] || ' ',
            size: bar.size || 20
        }
    
        this._units = options.units || [ 'octects', 'Ko', 'Mo', 'Go', 'To', 'Po' ]
        this._coef = options.unitsCoef || 1000
        
        this._timeFormat = options.time || 'HH:MM:SS'
    }
    
    setLayout(layout: string) {
        this._layout = layout
    }
    
    private update(value: number) {
        var now = Date.now()
        var diff = (now - this.lastDate) / 1000
        this.speed = value / diff
        this.lastDate = now
        this.size += value
    }
    
    private _generateBar() {
        var nbChr = Math.floor(this._bar.size * (this.size / this.total))
        var nbRest = this._bar.size - nbChr
        var bar = ""
        while (nbChr-- > 0)
            bar += this._bar.complete
        while (nbRest-- > 0)
            bar += this._bar.empty
        return bar
    }
    
    private _format(value: number, precision: number = 2) {
        var i = 0
        while (value > this._coef && i < this._units.length) {
            value /= this._coef
            i++
        }
        return value.toFixed(precision) + this._units[i]
    }
    
    template() {
        return this._layout.replace("%bar", this._generateBar())
        .replace("%pourcent", this.pourcent() + '%')
        .replace("%time", this.howManyTime())
        .replace("%size", this._format(this.size))
        .replace("%total", this._format(this.total))
        .replace("%speed", this._format(this.speed) + '/s')
    }
    
    setBar(size: number, charComplete: string = '=', charEmpty: string = ' ') {
        this._bar.complete = charComplete[0]
        this._bar.empty = charEmpty[0]
        this._bar.size = size
    }
    
    setTimeFormat(format: string) {
        this._timeFormat = format
    }
    
    setSize(size: number) {
        var value = size - this.size
        this.update(value)
    }
    
    addSize(value: number) {
        this.update(value)
    }
    
    setTotal(total: number) {
        this.total = total
    }
    
    addTotal(value: number) {
        this.total += value
    }
    
    pourcent(precision: number = 2) {
        return ((this.size / this.total) * 100).toFixed(precision)
    }
    
    setUnits(units: Array<string>, coef: number = 1000) {
        this._units = units
        this._coef = coef
    }
    
    howManyTime() {
        var seconds = Math.round((this.total - this.size) / this.speed)
        return Format.time(seconds)
    }
}