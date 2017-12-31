let log4js = require('log4js');
let logger = log4js.getLogger('ServiceWX');
let fetch = require('node-fetch')
fetch.Promise = require('bluebird')
let _ = require('lodash')
let querystring = require('querystring')
let UUID = require('uuid')
let UserClient = require('../model').userClient
let PreOrder = require('../model').porder

let EN = process.env
let key = EN.wxsecret
let config = {
  appid: EN.wxappid,
  mch_id: EN.wxmch_id,
  body: EN.wxbody,
  notify_url: EN.wxnotify_url,
  trade_type: 'APP',
  spbill_create_ip: EN.wxspBillCreateIp,
  attach: EN.wxAttach
}
let config2 = {
  appid: EN.wxappid,
  partnerid: EN.wxmch_id
}

let PostOpts = {method:'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
function GetOpts(params) {
	return _.assign(PostOpts, {body:querystring.stringify(params)})
}
const url_pre_order = "https://api.mch.weixin.qq.com/pay/unifiedorder" // https post
let Redis = require('../db/redis.init')
const price = [parseInt(EN.feebig), parseInt(EN.feemiddle), parseInt(EN.feesmall)]
exports.createPreOrder = function(openid, type, num, spBillCreateIp){
  return UserClient.find({_id: openid}).then(user => {
    if(user) {


        let date = Date.now()
        let out_trade_no = UUID.v1().replace(/-+/g, "")
        let nonce_str = createNonceStr()
      	let fee = (price[type] * num) + ''
        // store the pre order to redis
        let content = {
          _id: out_trade_no,
          openid: openid,
          type: type ,
          num: num ,
          date: date,
          platform: 'wx',
          name: user.name,
          address: user.adddress,
      		fee: fee,
          stat: 3
        }

        return new PreOrder(content).save().then(ok => {
			    if(!ok) {
			      return {code:1, msg:'预存储订单失败'}
			    }

          config.nonce_str = nonce_str
          config.out_trade_no = out_trade_no
          config.total_fee = parseInt(fee)

          let sign0 = sign(config)
          console.log(sign0)
          let formData = createFormData(config, sign0)
          console.log(formData)
          // formData = '<xml><appid>wx2421b1c4370ec43b</appid><attach>支付测试</attach><body>商品描述</body><mch_id>10000100</mch_id><nonce_str>b71xw5k4xkxh6pq</nonce_str><notify_url>https://aaa.bigfacewo.com/dwssserverso/order_notify</notify_url><out_trade_no>a774ff50ed6211e7940d93b0403a63b9</out_trade_no><spbill_create_ip>119.23.238.170</spbill_create_ip><total_fee>2000</total_fee><trade_type>APP</trade_type><sign>E7B659D5A83180373BB5D93008E1F282</sign></xml>'
          return fetch(url_pre_order, _.assign(PostOpts, {body: formData})).then(res => {
            if(res.status === 200) {
              return res.text()
            } else {
              return false
            }
          }).then(xmldata => {
            if(xmldata) {
              console.log("这是微信的统一下单方法https返回", xmldata)
              let prepay_id = getXMLNodeValue('prepay_id', xmldata)
              prepay_id = getPrepayID(prepay_id)
              if(!prepay_id) {
                return {code:1, msg:'prepay_id is null'}
              }

              // 签名
              let timeStamp = createTimeStamp(date)
              config2.nonce_str = nonce_str
              config2.package = 'Sign=WXPay'
              config2.prepayid = prepay_id
              config2.timestamp = timeStamp
              let paySign = sign(config2)

              return {
                code:0,
                out_trade_no: out_trade_no,
                nonce_str: nonce_str,
                prepay_id: prepay_id,
                timeStamp: timeStamp,
                paySign: paySign
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

    } else {
      return {code:1, msg:'用户不存在-' + openid}
    }
  }).error(e => {
    return {code:1, msg:'mongo error', err:e}
  })


}









const crypto = require('crypto')
function sign(params) {
  console.log("签名验证的参数", params)
  let str= raw(params) + '&key=' + key
  console.log(str)
  return crypto.createHash('md5').update(str,'utf8').digest('hex').toUpperCase()
}
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
function createFormData(params, sign) {

    let formData = "<xml>"
    formData += "<appid>" + params.appid + "</appid>"
    formData += "<attach>" + params.attach + "</attach>"
    formData += "<body>" + params.body + "</body>"
    formData += "<mch_id>" + params.mch_id + "</mch_id>"
    formData += "<nonce_str>" + params.nonce_str + "</nonce_str>"
    formData += "<notify_url>" + params.notify_url + "</notify_url>"
    formData += "<out_trade_no>" + params.out_trade_no + "</out_trade_no>"
    formData += "<spbill_create_ip>" + params.spbill_create_ip + "</spbill_create_ip>"
    formData += "<total_fee>" + params.total_fee + "</total_fee>"
    formData += "<trade_type>" + params.trade_type + "</trade_type>"
    formData += "<sign>" + sign + "</sign>"
    formData += '</xml>'
    return formData
}
// 随机字符串产生函数
 function createNonceStr() {
   //return "b71xw5k4xkxh6pq"
    return Math.random().toString(36).substr(2, 15)
}

// 时间戳产生函数
function createTimeStamp(date) {
    return parseInt(date / 1000) + ''
}
function getXMLNodeValue(node_name, xml) {
    let tmp = xml.split("<" + node_name + ">")
    if(tmp.length > 1) {
      let _tmp = tmp[1].split("</" + node_name + ">")
      if(_tmp.length > 0)
        return _tmp[0]
    }
    return null
}
function getPrepayID(data) {
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
