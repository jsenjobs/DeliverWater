let fs = require('fs')
//签名
const crypto = require('crypto')
//读取秘钥
let conf = require('../app/conf')
let path = require('path')
conf.boot(path.resolve('./etc'), path.resolve('../etc'))
let alipaypublickey = process.env.alialipaypublickey //
alipaypublickey = createPrivatePem(alipaypublickey, '\n', 64)
alipaypublickey = "-----BEGIN PUBLIC KEY-----\n" + alipaypublickey + '-----END PUBLIC KEY-----\n'
let appprivatekey = process.env.aliappprivatekey //
appprivatekey = createPrivatePem(appprivatekey, '\n', 64)
appprivatekey = "-----BEGIN PRIVATE KEY-----\n" + appprivatekey + '-----END PRIVATE KEY-----\n'
console.log(appprivatekey)
function sign(prestr) {
    try {
        var signer = crypto.createSign('RSA-SHA1');
        signer.update(prestr);
        return signer.sign(appprivatekey, 'base64')
    } catch(err) {
        console.log('err', err)
    }
}
function verify(sdata, sign) {
  let verifier = crypto.createVerify('RSA-SHA1')
  verifier.update(new Buffer(sdata, 'utf-8'))
  return verifier.verify(alipaypublickey, sign, 'base64')
}

let sg = sign('a=123')
console.log(sg)
console.log(verify('a=123', sg))

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
