
let _ = require('lodash')
let crypto = require('crypto')
// 对象转参数, LowCase
function raw (args) {
    let keys = Object.keys(args)
    keys = keys.sort()
    let newArgs = {}
    keys.forEach(key => {
        newArgs[key.toLowerCase()] = args[key]
    })
    let string = ''
    for (let k in newArgs) {
        string += '&' + k + '=' + newArgs[k]
    }
    string = string.substr(1)
    return string
}

function raw1 (args) {
  let keys = Object.keys(args)
  keys = keys.sort()
  let newArgs = {}
  keys.forEach(key => {
    newArgs[key] = args[key]
  })
  let string = ''
  for(let k in newArgs) {
    string += '&' + k + '=' + newArgs[k]
  }
  string = string.substring(1)
  return string
}


// 随机字符串产生函数
exports.createNonceStr = function () {
    return Math.random().toString(36).substr(2, 15)
}

// 时间戳产生函数
exports.createTimeStamp = function (date) {
    return parseInt(date / 1000) + ''
}

exports.getSign = function (params, key) {
  let strings = raw(params)
  strings = strings + '&key=' + key
  let sign = crypto.createHash('md5').update(strings, 'utf8').digest('hex')
  return sign.toUpperCase()
}

exports.getPreSign = function (params, key) {
  let string = raw1(params)
  string = string + '&key=' + key
  let sign = crypto.createHash('md5').update(string, 'utf8').digest('hex')
  return sign
}

exports.getXMLNodeValue = function(node_name, xml) {
    let tmp = xml.split("<" + node_name + ">")
    if(tmp.length > 1) {
      let _tmp = tmp[1].split("</" + node_name + ">")
      if(_tmp.length > 0)
        return _tmp[0]
    }
    return null
}
exports.getPrepayID = function(data) {
  if(data) {
    let tmp = data.split('[')
    if(tmp && tmp.length > 2) {
      let tmp1 = tmp[2].split(']')
      if(tmp1 && tmp1.length > 0) {
        return tmp1[0]
      }
    }
  }
  return null
}

exports.createFormData = function(params, key) {
  let formData = "<xml>"
  formData += "<appid>" + params.appid + "</appid>"
  formData += "<mch_id>" + params.mch_id + "</mch_id>"
  formData += "<nonce_str>" + params.nonce_str + "</nonce_str>"
  formData += "<body>" + params.body + "</body>"
  formData += "<attach>" + params.attach + "</attach>"
  formData += "<out_trade_no>" + params.out_trade_no + "</out_trade_no>"
  formData += "<total_fee>" + params.total_fee + "</total_fee>"
  formData += "<spbill_create_ip>" + params.spbill_create_ip + "</spbill_create_ip>"
  formData += "<notify_url>" + params.notify_url + "</notify_url>"
  formData += "<trade_type>" + params.trade_type + "</trade_type>"
  formData += "<openid>" + params.openid + "</openid>"
  formData += "<sign>" + exports.getSign(params, key) + "</sign>"
  formData += '</xml>'
  return formData
}

// console.log(exports.createNonceStr())
// console.log(exports.createTimeStamp())
// console.log(exports.getSign({a:123, C:'sub'}))
