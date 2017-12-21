
let log4js = require('log4js');
let logger = log4js.getLogger('ServicePayWeChat');
let fetch = require('node-fetch')
fetch.Promise = require('bluebird')
let _ = require('lodash')
let querystring = require('querystring')
let UUID = require('uuid')
let WXUtils = require('../utils').WXUtils
let Redis = require('../db/redis.init')

const appid = process.env.wxappid
const secret = process.env.wxsecret
const mchid = process.env.wxmchid
const spBillCreateIp = process.env.wxspBillCreateIp // 本服务器的外网IP地址
const notify_url = process.env.wxnotify_url // https 支付成功的通知
const key = process.env.wxkey // 注：key为商户平台设置的密钥key

const url_base = "https://api.weixin.qq.com/sns/jscode2session?appid="+appid+"&secret="+secret
const url_pre_order = "https://api.mch.weixin.qq.com/pay/unifiedorder" // https post
let PostOpts = {method:'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}}

function GetOpts(params) {
	return _.assign(PostOpts, {body:querystring.stringify(params)})
}

// 获取openId
exports.onlogin = function(code) {
	console.log(code)
  let url = url_base + '&js_code=' + code + "&grant_type=authorization_code"

  return fetch(url).then(res => {
    if(res.status == 200) {
      return _.assign(res.json(), {code:0})
    } else {
      return {code:1, msg:'return code:' + res.status}
    }
  }).error(e => {
    return {code:1, msg:'unknown', err:e}
  })
}


// 预创建订单
const price = [2000, 1000, 500]
// url是该小程序链接的socket的http ip地址
exports.createPreOrder = function(openid, type, num) {
	return exports.mockCreatePreOrder(openid, type, num)
  let uuid = UUID.v1()
	let date = Date.now()
	let trade_no = "dilver-water-" + uuid
	// store the pre order to redis
	let content = {
		_id: trade_no,
		openid: openid,
		type: (type || type === 0) ? type : 1,
		num: num > 0 && 2000 > num ? num:1,
		date: date,
		stat: 3
	}
	content = JSON.stringify(content)
	return Redis.SetAndOutRemove("dw:pre:order:" + trade_no, content, 36000).then(ok => {
		if(!ok) {
			return {code:1, msg:'预存储订单失败'}
		}
		let nonce_str = WXUtils.createNonceStr()
	  let timeStamp = WXUtils.createTimeStamp(date)
		let params = {
			appid: appid,
			mch_id: mchid,
			nonce_str: nonce_str,
			body: '惠民订水付款',
			attach: '惠民订水付款',
			out_trade_no: trade_no,
			total_fee: price[type],
			spbill_create_ip: spBillCreateIp,
			notify_url: notify_url,
			trade_type: 'JSAPI',
			openid: openid
		}
		let formData = WXUtils.createFormData(params, key)
		return fetch(url_pre_order, _.assign(PostOpts, {body: formData})).then(res => {
			if(res.status === 200) {
				return res.text()
			} else {
				return false
			}
		}).then(xmldata => {
	    if(xmldata) {
	      let prepay_id = WXUtils.getXMLNodeValue('prepay_id', xmldata)
				prepay_id = WXUtils.getPrepayID(prepay_id)

	      // 签名
				console.log(6)
	      let prepay_id_sig = WXUtils.getPreSign({
					appId: appid,
					nonceStr: nonce_str,
					package: 'prepay_id=' + prepay_id,
					signType: 'MD5',
					timeStamp: timeStamp
				}, key)
				console.log(7)
	      return {
	        code:0,
					appId: appid,
	        timeStamp: timeStamp,
	        nonceStr: nonce_str,
	        signType: 'MD5',

	        package: prepay_id,
	        paySign: prepay_id_sig
	      }
	    } else {
	      return {code:1, msg:'创建订单失败-2', err:res.status}
	    }
	  }).error(e => {
	    return {code:1, msg:'fetch error', err:e}
	  })

	}).error(e => {
			logger.error('保存订单失败：' + e)
			return {code:1, msg:'保存订单失败', err:e}
	})
}


exports.mockCreatePreOrder = function(openid, type, num) {
  let uuid = UUID.v1()
	let date = Date.now()
	let trade_no = "dilver-water-" + uuid
	// store the pre order to redis
	let content = {
		_id: trade_no,
		openid: openid,
		type: (type || type === 0) ? type : 1,
		num: num > 0 && 2000 > num ? num:1,
		date: date,
		stat: 3
	}
	console.log(1)
	content = JSON.stringify(content)
	return Redis.SetAndOutRemove("dw:pre:order:" + trade_no, content, 36000).then(ok => {
		if(!ok) {
			return {code:1, msg:'预存储订单失败'}
		}
		console.log(2)
		let nonce_str = WXUtils.createNonceStr()
	  let timeStamp = WXUtils.createTimeStamp(date)
		let params = {
			appid: appid,
			mch_id: mchid,
			nonce_str: nonce_str,
			body: '惠民订水付款',
			attach: '惠民订水付款',
			out_trade_no: trade_no,
			total_fee: price[type],
			spbill_create_ip: spBillCreateIp,
			notify_url: notify_url,
			trade_type: 'JSAPI',
			openid: openid
		}
		console.log(3)
		let formData = WXUtils.createFormData(params, key)
		return fetch(url_pre_order, _.assign(PostOpts, {body: formData})).then(res => {
			if(res.status === 200) {
				return res.text()
			} else {
				return false
			}
		}).then(xmldata => {
		console.log(4)
	    if(xmldata) {
	      let prepay_id = WXUtils.getXMLNodeValue('prepay_id', xmldata)
				prepay_id = WXUtils.getPrepayID(prepay_id)

	      // 签名
				console.log(5)
	      let prepay_id_sig = WXUtils.getPreSign({
					appId: appid,
					nonceStr: nonce_str,
					package: 'prepay_id=wx201411101639507cbf6ffd8b0779950874',
					signType: 'MD5',
					timeStamp: timeStamp
				}, key)
				console.log(6)
	      return {
	        code:0,
					appId: appid,
	        timeStamp: timeStamp,
	        nonceStr: nonce_str,
	        signType: 'MD5',

	        package: "wx201411101639507cbf6ffd8b0779950874",
	        paySign: prepay_id_sig
	      }
	    } else {
	      return {code:1, msg:'创建订单失败-2', err:res.status}
	    }
	  }).error(e => {
	    return {code:1, msg:'fetch error', err:e}
	  })

	}).error(e => {
			logger.error('保存订单失败：' + e)
			return {code:1, msg:'保存订单失败', err:e}
	})
}
