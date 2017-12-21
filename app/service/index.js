let paywechat = require('./paywechat')
let models = {
	'paywechat' : paywechat,
}

exports.boot = function(app) {
    app.use(function(req,res, next) {
        req.models = models;
        return next();
    })
}
