
let log4js = require('log4js');
let logger = log4js.getLogger('ServiceAli');
let UUID = require('uuid')


const fs = require('fs')
let Utils = require('../utils').Utils
let Promise = require('bluebird')



const EN = process.env
const alipaypublickey = EN.alialipaypublickey

let config = {
	alipay_sdk: 'alipay-sdk-java-dynamicVersionNo',
  app_id: EN.aliappid,
  method: 'alipay.trade.app.pay',
  charset: 'UTF-8',
  sign_type: 'RSA',
  version: '1.0',
	format: 'json',
  notify_url: EN.alinotifyurl,
  // biz_content: {},
  // timestamp: '',
	// sign:''
}
let biz_content = {
	body: EN.alibody,
	subject: EN.alisubject,
	product_code: EN.aliproductCode,
	timeout_express: '30m',
	seller_id: EN.sellerid,
	// out_trade_no: '',
	// total_amount: '0.01'
}


//发送订单号// 预创建订单
const price = [parseInt(EN.feebig), parseInt(EN.feemiddle), parseInt(EN.feesmall)]
let Redis = require('../db/redis.init')
exports.createPreOrder = function(openid, type, num) {
  let date = Date.now()
  let out_trade_no = UUID.v1().replace(/-+/g, "")
	let fee = (parseFloat(price[type] * num) / 100.0) + ''
	// store the pre order to redis
	let content = {
		_id: out_trade_no,
		openid: openid,
		type: type ,
		num: num ,
		date: date,
		platform: 'ali',
		fee: fee,
		stat: 3
	}
  content = JSON.stringify(content)
  return Redis.SetAndOutRemove('dw:pre:order:' + out_trade_no, content, 36000).then(ok => {
    if(!ok) {
      return {code:1, msg:'预存储订单失败'}
    }

		biz_content.total_amount = fee
		biz_content.out_trade_no = out_trade_no
		config.biz_content = JSON.stringify(biz_content)
    config.timestamp = createTimeStamp(date)

		config.sign = sign(config)
    let last = encodeParams(config)
		last = raw2(last)
    console.log(last)
    return {code:0, data: last}
  })
}





//签名
const crypto = require('crypto')
//读取秘钥
// let appprivatekey = fs.readFileSync('./app_private_key.pem').toString()//
let appprivatekey = EN.aliappprivatekey //
appprivatekey = createPrivatePem(appprivatekey, '\n', 64)
appprivatekey = "-----BEGIN PRIVATE KEY-----\n" + appprivatekey + '-----END PRIVATE KEY-----\n'
function sign(params) {
    try {
        var prestr = raw(params)
        var signer = crypto.createSign('RSA-SHA1');
        signer.update(prestr);
        return signer.sign(appprivatekey, 'base64')
    } catch(err) {
        console.log('err', err)
    }
}
//将支付宝发来的数据生成有序数列
function raw (args) {
	let keys = Object.keys(args)
	keys = keys.sort()
	let newArgs = {}
	keys.forEach(key => {
		if(key != 'sign' && args[key]) {
			newArgs[key] = args[key]
		}
	})
	let string = ''
	for(let k in newArgs) {
		string += '&' + k + '=' + newArgs[k]
	}
	string = string.substr(1)
	return string
}
function raw2 (args) {
	let keys = Object.keys(args)
	keys = keys.sort()
	let newArgs = {}
	keys.forEach(key => {
		if(args[key]) {
			newArgs[key] = args[key]
		}
	})
	let string = ''
	for(let k in newArgs) {
		string += '&' + k + '=' + newArgs[k]
	}
	string = string.substr(1)
	return string
}

function encodeParams(params) {
  let res = {}
  for(let key in params) {
    res[key] = encodeURIComponent(params[key])
  }
  return res
}
// 时间戳产生函数
let moment = require('moment')
function createTimeStamp (date) {
	return moment(date).format('yyyy-MM-dd HH:mm:ss')
}





/**
 * 在指定位置插入字符串
 * @param str
 * @param insert_str
 * @param sn
 * @returns {string}
 */
function createPrivatePem(str, insert_str, sn) {
  var newstr = "";
    for (var i = 0; i < str.length; i += sn) {
        var tmp = str.substring(i, i + sn);
        newstr += tmp + insert_str;
    }
    return  newstr
}
