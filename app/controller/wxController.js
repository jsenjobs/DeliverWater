let log4js = require('log4js');
let logger = log4js.getLogger('ControllerWx');


/**
    @name wxCreatePreOrder
    @link /prepay/wx/:openid/:type/:num
    @method GET
    @desc 创建预订单 (https)
    @param {'name':'type','type':'number','des':'桶装水的类型'}
    @param {'name':'num','type':'number','des':'桶装水的数量'}
    @param {'name':'openid','type':'string','des':'ID'}
**/
exports.wxCreateOrder = function(req, res) {
    logger.info('wxCreateOrder Api Call')

    let type = req.params.type
    let num = req.params.num
    let openid = req.params.openid

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
    if(type < 0 || type > 2 || num < 1 || num > 2000 || !openid) {
      return res.status(200).json({code:1, msg:'参数错误'})
    }

    req.models.payWx.createPreOrder(openid, type, num, req.ip).then(result => {
        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(200).json({code:1, 'msg':'unknown'})
        }
    })
}
