let log4js = require('log4js');
let logger = log4js.getLogger('ControllerWx');


/**
    @name getWXCode
    @link /wx/onLogin
    @method POST
    @desc 获取用户openid (https)
    @param {'name':'code','type':'string','des':'小程序用户调用wx.login登入获取的code'}
**/
exports.wxOnLogin = function(req, res) {
    logger.info('wx  user get code Api Call')
    let code = req.body.code

    req.models.paywechat.onlogin(code).then(result => {
        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(200).json({code:1, 'msg':'unknown'})
        }
    })
}

/**
    @name createPreOrder
    @link /wx/createPreOrder
    @method POST
    @desc 创建预订单 (https)
    @param {'name':'type','type':'number','des':'桶装水的类型'}
    @param {'name':'num','type':'number','des':'桶装水的数量'}
    @param {'name':'openid','type':'string','des':'wxOnLogin返回的openID'}
**/
exports.createOrder = function(req, res) {
    logger.info('wx  create order Api Call')

    let type = req.body.type
    let num = req.body.num
    let openid = req.body.openid
    try {
      type = parseInt(type)
    } catch(e) {
      return res.status(200).json({code:1, msg:'type参数错误'})
    }
    try {
      num = parseInt(num)
    } catch(e) {
      return res.status(200).json({code:1, msg:'num参数错误'})
    }
    if(type < 0 || type > 2 || num < 1 || num > 200 || !openid) {
      return res.status(200).json({code:1, msg:'参数错误'})
    }

    req.models.paywechat.createPreOrder(openid, type, num).then(result => {
        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(200).json({code:1, 'msg':'unknown'})
        }
    })
}
