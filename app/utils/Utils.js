// 随机字符串产生函数
exports.createNonceStr = function () {
    return Math.random().toString(36).substr(2, 15)
}

// 时间戳产生函数
exports.createTimeStamp = function (date) {
    return parseInt(date / 1000) + ''
}

let _ = require('lodash')
let querystring = require('querystring')
let PostOpts = {method:'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
exports.GetOpts = function (params) {
	return _.assign(PostOpts, {body:querystring.stringify(params)})
}
