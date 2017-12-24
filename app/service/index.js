let payAli = require('./payAli')
let payWx = require('./payWx')
let paywechat = require('./paywechat')
let models = {
	'payAli' : payAli,
	'payWx' : payWx,
	'paywechat' : paywechat,
}

exports.boot = function(app) {
    app.use(function(req,res, next) {
        req.models = models;
        return next();
    })
}
