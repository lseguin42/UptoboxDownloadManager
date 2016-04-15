
/*
var generator = require('interface-generator-ts')

generator(object1, object2, object3)
*/

//"paramName": "type"

function notInAll(list: string[][]) {
    var res: string[] = []
    list.forEach((subList) => {
        list.forEach((subOtherList) => {
            subList.forEach((str) => {
                if (subOtherList.indexOf(str) === -1 && res.indexOf(str) === -1) {
                    res.push(str)
                }
            })
        })
    })
    return res
}

function arrayType(array: Array<any>) {
    var types = []
    array.forEach((elem) => {
        if (types.indexOf(typeof elem) == -1)
            types.push(typeof elem)
    })
    if (types.indexOf('function') !== -1)
        throw "function type not supported !";
    if (types.length == 1) {
        return types[0]
    }
    if (types.indexOf('object')) {
        return 'any'
    }
    var res = ''
    types.forEach((elem) => {
        if (res !== '')
            res += '|'
        res += elem
    })
    return res
}

function interfaceGen(...args: any[]) {
    
    var params: { name: string, types: string[], count: number }[] = []
    
    args.forEach((obj) => {
        if (obj instanceof Array)
            throw "Error Object Given is an array";
        Object.keys(obj).forEach((key) => {
            var filter = params.filter((value) => {
                if (value.name === key)
                    return true
                return false
            })
            var param = { name: key, types: [], count: 0 }
            if (filter.length !== 0) {
                param = filter[0]
            } else {
                params.push(param)
            }
            param.count++
            var type = (obj[key] instanceof Array ? 'Array<' + arrayType(obj[key]) + '>' : typeof obj[key])
            if (param.types.indexOf(type) == -1 && obj[key] !== null) {
                param.types.push(type)
            }
        })
    })
   
    var communArgs = params.filter((param) => {
        return param.count === args.length
    })
    var optionalArgs = params.filter((param) => {
        return param.count !== args.length
    })
   
   params.forEach((param) => {
       if (param.types.length == 1 && param.types[0] == "Array<object>") {
           var tab = []
           args.forEach((obj) => {
               tab = tab.concat(obj[param.name] || [])
           })
           interfaceGen.apply(null, tab)
       }
   })
   
    console.log(communArgs, optionalArgs)
}

var object1 = {
    hello: "miaou",
    toto: [
        "oijwodqijodi",
        "owqkdqpok",
        "wqdpokdpoqwdk",
        "pqwokdokd"
    ],
    ptdr: [{
        toto: "haah"
    }]
}

var object2 = {
    hello: 78,
    toto: [
        "oijwodqijodi",
        "owqkdqpok",
        "wqdpokdpoqwdk",
        "pqwokdokd",
        "dpwqokd",
        "p[dp[qwl]]"
    ],
    ptdr: null
}

var object3 = {
    hello: "coucou",
    ptdr: [{
        toto: "haah"
    }]
}

interfaceGen(object1, object2, object3)