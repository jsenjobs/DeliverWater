!function(e){function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={};t.m=e,t.c=r,t.i=function(e){return e},t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=11)}([function(e,t){e.exports=require("log4js")},function(e,t){e.exports=require("bluebird")},function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("path")},function(e,t){e.exports=require("lodash")},function(e,t,r){"use strict";var n=(r(4),r(0)),o=n.getLogger("RedisIniter"),s=r(46),i=(r(1),void parseInt(process.env.SessionTimeOut));String.prototype.startWith=function(e){return new RegExp("^"+e).test(this)},String.prototype.endWith=function(e){return new RegExp(e+"$").test(this)},t.boot=function(){var e=r(28).getParams(process.env.RedisUrl);i=new s({port:e.port,host:e.host,family:4,retryStrategy:function(e){return Math.min(50*e,2e3)}});var t=new s(e.port,e.host);i.on("ready",function(){o.info("Ready")}),t.on("ready",function(){t.psubscribe("__keyevent@0__:expired")}),i.on("connect",function(){o.info("connect")}),t.on("pmessage",function(e,t,r){if(r.startWith("serverso")){var n=r.substring(8,r.length);i.lrem("so:server",-1,n)}}),i.on("reconnect",function(){o.warn("reconnect")}),i.on("error",function(e){o.error("error "+e)})},t.SetAndOutRemove=function(e,t,r){return i.set(e,t).then(function(t){return i.expire(e,r)})},t.Get=function(e){return i.get(e)},t.GetAndRemove=function(e){return i.get(e).then(function(t){return i.del(e),t})},t.Del=function(e){return i.del(e).then(function(e){return e>0})},t.client=function(){return i}},function(e,t){e.exports=require("crypto")},function(e,t){e.exports=require("querystring")},function(e,t){e.exports=require("uuid")},function(e,t){e.exports={createAliPreOrder:{params:[{name:"type",type:"number",des:"桶装水的类型"},{name:"num",type:"number",des:"桶装水的数量"},{name:"openid",type:"string",des:"id"}],_links:"/prepay/ali/:openid/:type/:num",method:"GET",des:"创建预订单 (https)"},appStatus:{params:[{name:"info",type:"任意",des:"详细信息",necessary:!1}],_links:"/app/status",method:"GET",des:"服务器信息"},listinfo:{params:[],_links:"/app/listinfo",method:"GET",des:"显示api信息"},getLog:{params:[{name:"filename",type:"string",des:"日志文件名字",necessary:!1}],_links:"/app/getLog",method:"GET",des:"获取日志文件，beta"},wxCreatePreOrder:{params:[{name:"type",type:"number",des:"桶装水的类型"},{name:"num",type:"number",des:"桶装水的数量"},{name:"openid",type:"string",des:"ID"}],_links:"/prepay/wx/:openid/:type/:num",method:"GET",des:"创建预订单 (https)"},getWXCode:{params:[{name:"code",type:"string",des:"小程序用户调用wx.login登入获取的code"}],_links:"/wx/onLogin",method:"POST",des:"获取用户openid (https)"},createPreOrder:{params:[{name:"type",type:"number",des:"桶装水的类型"},{name:"num",type:"number",des:"桶装水的数量"},{name:"openid",type:"string",des:"wxOnLogin返回的openID"}],_links:"/wx/createPreOrder",method:"POST",des:"创建预订单 (https)"}}},function(e,t,r){"use strict";t.WXUtils=r(35),t.Utils=r(34)},function(e,t,r){"use strict";var n=r(17),o=r(3);r(14).boot(o.resolve("./etc"),o.resolve("../etc"));var s=r(16),i=r(15);if(n.isMaster){console.log(" Fork %s worker(s) from master",1);for(var a=0;a<1;a++)n.fork();n.on("online",function(e){console.log("worker is running on %s pid",e.process.pid)}),n.on("exit",function(e,t,r){console.log("worker with %s is closed",e.process.pid)})}else n.isWorker&&(console.log("worker (%s) is running",n.worker.process.pid),s.boot());n.on("death",function(e){console.log("worker "+e.pid+" died. restart..."),n.fork()});var c=r(2),u=o.join(process.cwd(),"runtime","lock");if(!function(e){try{c.accessSync(e,c.F_OK)}catch(e){return!1}return!0}(u)){var p=c.createWriteStream(u);p.write("lock"),p.end(),i.RegisterTask()}},function(e,t){e.exports=require("moment")},function(e,t){e.exports=require("node-fetch")},function(e,t,r){"use strict";var n=r(19),o=r(20);t.boot=function(e,t){n.boot(e,t),o.boot()}},function(e,t,r){"use strict";t.RegisterTask=r(29).RegisterTask},function(e,t,r){"use strict";(function(e){function n(){"test"!==y.get("env")&&y.listen(h,function(){i.info("服务器端口："+h)})}function o(){_.close()}var s=r(0),i=s.getLogger("server"),a=r(43),c=r(44),u=(r(3),r(38));r(39)(u);var p=r(41),d=r(1),f=(d.promisifyAll(r(2)),r(9)),l=r(27),m=r(24),g=r(30),y=a();g.boot(y),y.use(u.urlencoded({extended:!0})),y.use(u.json()),y.use(u.xml({limit:"1MB",xmlParseOptions:{normalize:!0,normalizeTags:!0,explicitArray:!1}})),y.use(p());var v=r(42);y.use(v()),m.boot(y),l.boot(),y.all("*",function(e,t){t.status(404).json({code:404,msg:"没有此Api",_links:f})}),y.use(function(e,t,r,n){return"UnauthorizedError"===e.name?void r.status(401).json({code:401,errCode:401e3,msg:"未许可Api"}):r.headersSent?n(e):(r.status(500),void r.json({code:500,msg:"发生未知错误",_links:f}))});var h=process.env.PORT||3e3,_=c.createServer(y);_.on("error",function(e){i.error(e)}),process.on("uncaughtException",function(e){i.error(e),i.error(e.stack)}),t.app=y,t.boot=n,t.shutdown=o,t.port=h,r.c[r.s]===e?r(11):console.log("Running app as a module")}).call(t,r(36)(e))},function(e,t){e.exports=require("cluster")},function(e,t,r){"use strict";var n=process.env,o=r(1),s=o.promisifyAll(r(2)),i=r(3),a=function(e){try{s.accessSync(e,s.F_OK)}catch(e){return!1}return!0},c=function(e){if(a(e)){var t=s.readFileSync(e,"utf8");if(t){var r=JSON.parse(t);u(n,"",r)}}},u=function e(t,r,n){if(n instanceof Array)t[r]=n;else if(n instanceof Object)for(var o in n)e(t,r+o,n[o]);else t[r]=n};t.ENVSET=function(e,t){e&&(c(i.join(e,"project.json")),c(i.join(e,"db.json")),c(i.join(e,"cluster.json"))),t&&(c(i.join(t,"project.json")),c(i.join(t,"db.json")),c(i.join(t,"cluster.json"))),"production"===process.env.model&&(e&&(c(i.join(e,"production","project.json")),c(i.join(e,"production","db.json")),c(i.join(e,"production","cluster.json"))),t&&(c(i.join(t,"production","project.json")),c(i.join(t,"production","db.json")),c(i.join(t,"production","cluster.json"))))}},function(e,t,r){"use strict";var n=r(18);t.boot=function(e,t){n.ENVSET(e,t)}},function(e,t,r){"use strict";var n=r(21);t.boot=function(){n.set()}},function(e,t,r){"use strict";var n=r(3),o=process.env.name;o=o||"app";var s=n.join(process.cwd(),"logs",o),i={appenders:{STDOUT:{type:"stdout",layout:{type:"ENCODER_PATTERN",separator:","},filter:{level:"error"}},FILE:{type:"dateFile",filename:n.join(s,"common"),pattern:"_yyyy-MM-dd.log",compress:!0,alwaysIncludePattern:!0,layout:{type:"ENCODER_PATTERN",separator:","}},error:{type:"dateFile",filename:n.join(s,"error"),pattern:"_yyyy-MM-dd.log",compress:!0,alwaysIncludePattern:!0,levelFilter:{level:"error"},layout:{type:"ENCODER_PATTERN",separator:","}},ERROR_FILE:{type:"logLevelFilter",appender:"error",level:"error"}},categories:{default:{appenders:["STDOUT","FILE","ERROR_FILE"],level:"info"}}},a=r(12);t.set=function(){var e=r(0);e.addLayout("ENCODER_PATTERN",function(e){return function(e){return a(e.startTime).format("YYYY-MM-DD HH:MM:ss.SSS")+" [main] "+e.level.levelStr+" "+e.categoryName+" - "+e.data}}),e.configure(i)}},function(e,t,r){"use strict";var n=r(0),o=n.getLogger("ControllerAli");t.createAliPrepayOrder=function(e,t){o.info("createAliPrepayOrder Api Call");var r=e.params.type,n=e.params.num,s=e.params.openid;try{r=parseInt(r)}catch(e){return t.status(200).json({code:1,msg:"type参数错误"})}try{n=parseInt(n)}catch(e){return t.status(200).json({code:1,msg:"num参数错误"})}if(r<0||r>2||n<1||n>2e3||!s)return t.status(200).json({code:1,msg:"参数错误"});e.models.payAli.createPreOrder(s,r,n).then(function(e){return e?t.status(200).json(e):t.status(200).json({code:1,msg:"unknown"})})}},function(e,t,r){"use strict";var n=r(0),o=n.getLogger("ControllerApp"),s=r(48),i=r(40).exec,a=r(37),c=new Date,u=r(3),p=r(1),d=p.promisifyAll(r(2));t.status=function(e,t){o.info("Status Api Call");var r=e.app;if(e.query.info){var n={};a.parallel([function(e){i("netstat -an | grep :80 | wc -l",function(t,r){n[80]=parseInt(r,10),e()})},function(e){i("netstat -an | grep :"+r.set("port")+" | wc -l",function(t,o){n[r.set("port")]=parseInt(o,10),e()})}],function(e){t.json({status:"up",version:r.get("version"),sha:r.get("git sha"),started_at:c,node:{version:process.version,memory:Math.round(process.memoryUsage().rss/1024/1024)+"M",uptime:process.uptime()},system:{loadavg:s.loadavg(),freeMemory:Math.round(s.freemem()/1024/1024)+"M"},env:"production",hostname:s.hostname(),connections:n,swap:void 0})})}else t.json({status:"up"})};var f=r(9),l={code:0,data:f,model:process.env.model,PVersion:process.env.PVersion,state:process.env.state};t.listinfo=function(e,t){return t.status(200).json(l)};var m=function(e){return d.accessAsync(e,d.F_OK).then(function(e){return!0},function(e){return!1})},g=function(e){return d.readFileAsync(e,"utf8").then(function(e){if(e)return e})},y=function(e,t){var r=u.join(process.cwd(),"runtime","logs",e);m(r).then(function(e){return e?g(r).then(function(e){return e?t.status(200).json({code:0,data:e}):t.status(200).json({code:1})}):t.status(200).json({code:1})})};t.getLog=function(e,t){o.info("getLog api call"),e.query.filename?y(e.query.filename,t):y("latest.log",t)}},function(e,t,r){"use strict";var n=r(22),o=r(23),s=r(25),i=r(26);t.boot=function(e){e.get("/prepay/ali/:openid/:type/:num",n.createAliPrepayOrder),e.get("/app/status",o.status),e.get("/app/listinfo",o.listinfo),e.get("/app/getLog",o.getLog),e.get("/prepay/wx/:openid/:type/:num",s.wxCreateOrder),e.post("/wx/onLogin",i.wxOnLogin),e.post("/wx/createPreOrder",i.createOrder)}},function(e,t,r){"use strict";var n=r(0),o=n.getLogger("ControllerWx");t.wxCreateOrder=function(e,t){o.info("wxCreateOrder Api Call");var r=e.params.type,n=e.params.num,s=e.params.openid;try{r=parseInt(r)}catch(e){return t.status(200).json({code:1,msg:"type参数错误"})}try{n=parseInt(n)}catch(e){return t.status(200).json({code:1,msg:"num参数错误"})}if(r<0||r>2||n<1||n>2e3||!s)return t.status(200).json({code:1,msg:"参数错误"});e.models.payWx.createPreOrder(s,r,n,e.ip).then(function(e){return e?t.status(200).json(e):t.status(200).json({code:1,msg:"unknown"})})}},function(e,t,r){"use strict";var n=r(0),o=n.getLogger("ControllerWxTiny");t.wxOnLogin=function(e,t){o.info("wx  user get code Api Call");var r=e.body.code;e.models.paywechat.onlogin(r).then(function(e){return e?t.status(200).json(e):t.status(200).json({code:1,msg:"unknown"})})},t.createOrder=function(e,t){o.info("wx  create order Api Call");var r=e.body.type,n=e.body.num,s=e.body.openid;try{r=parseInt(r)}catch(e){return t.status(200).json({code:1,msg:"type参数错误"})}try{n=parseInt(n)}catch(e){return t.status(200).json({code:1,msg:"num参数错误"})}if(r<0||r>2||n<1||n>2e3||!s)return t.status(200).json({code:1,msg:"参数错误"});e.models.paywechat.createPreOrder(s,r,n).then(function(e){return e?t.status(200).json(e):t.status(200).json({code:1,msg:"unknown"})})}},function(e,t,r){"use strict";t.boot=function(){r(5).boot()}},function(e,t,r){"use strict";t.getParams=function(e){if(!e)return{};var t=e.split(/:\/\/|:|@|\/|\?/);return{type:t[0],username:t[1],password:t[2],host:t[3],port:t[4],db:t[5],param:t[6]}}},function(e,t,r){"use strict";function n(){var e=0;o.scheduleJob("*/1 * * * * *",function(){if(e+6e4<Date.now()){e=Date.now();var t=encodeURIComponent(process.env.Address),r=encodeURIComponent(process.env.name),n=encodeURIComponent(process.env.desc);a("http://"+process.env.Register+"/register/register?address="+t+"&name="+r+"&desc="+n,"GET",function(o,s,a,c){if(o||!s)return e=0,void i.error("Failure",o);var u="";try{u=JSON.parse(s)}catch(t){e=0,console.log(s)}o||!u||0==!u.code?(e=0,i.error("no register server at:http://"+process.env.Register+"/register/register?address="+t+"&name="+r+"&desc="+n)):i.info("register succeed at time:"+new Date)})}})}var o=r(47),s=r(0),i=s.getLogger("Task"),a=r(45);t.RegisterTask=function(){n()}},function(e,t,r){"use strict";var n=r(31),o=r(32),s=r(33),i={payAli:n,payWx:o,paywechat:s};t.boot=function(e){e.use(function(e,t,r){return e.models=i,r()})}},function(e,t,r){"use strict";function n(e){try{var t=o(e),r=g.createSign("RSA-SHA1");return r.update(t),r.sign(y,"base64")}catch(e){console.log("err",e)}}function o(e){var t=Object.keys(e);t=t.sort();var r={};t.forEach(function(t){"sign"!=t&&e[t]&&(r[t]=e[t])});var n="";for(var o in r)n+="&"+o+"="+r[o];return n=n.substr(1)}function s(e){var t=Object.keys(e);t=t.sort();var r={};t.forEach(function(t){e[t]&&(r[t]=e[t])});var n="";for(var o in r)n+="&"+o+"="+r[o];return n=n.substr(1)}function i(e){var t={};for(var r in e)t[r]=encodeURIComponent(e[r]);return t}function a(e){return v(e).format("yyyy-MM-dd HH:mm:ss")}var c=r(0),u=(c.getLogger("ServiceAli"),r(8)),p=(r(2),r(10).Utils,r(1),process.env),d=(p.alialipaypublickey,{alipay_sdk:"alipay-sdk-java-dynamicVersionNo",app_id:p.aliappid,method:"alipay.trade.app.pay",charset:"UTF-8",sign_type:"RSA",version:"1.0",format:"json",notify_url:p.alinotifyurl}),f={body:p.alibody,subject:p.alisubject,product_code:p.aliproductCode,timeout_express:"30m",seller_id:p.sellerid},l=[parseInt(p.feebig),parseInt(p.feemiddle),parseInt(p.feesmall)],m=r(5);t.createPreOrder=function(e,t,r){var o=Date.now(),c=u.v1().replace(/-+/g,""),p=parseFloat(l[t]*r)/100+"",g={_id:c,openid:e,type:t,num:r,date:o,platform:"ali",fee:p,stat:3};return g=JSON.stringify(g),m.SetAndOutRemove("dw:pre:order:"+c,g,36e3).then(function(e){if(!e)return{code:1,msg:"预存储订单失败"};f.total_amount=p,f.out_trade_no=c,d.biz_content=JSON.stringify(f),d.timestamp=a(o),d.sign=n(d);var t=i(d);return t=s(t),console.log(t),{code:0,data:t}})};var g=r(6),y=p.aliappprivatekey;y=function(e,t,r){for(var n="",o=0;o<e.length;o+=64)n+=e.substring(o,o+64)+"\n";return n}(y),y="-----BEGIN PRIVATE KEY-----\n"+y+"-----END PRIVATE KEY-----\n";var v=r(12)},function(e,t,r){"use strict";function n(e){console.log("签名验证的参数",e);var t=o(e)+"&key="+y;return w.createHash("md5").update(t,"utf8").digest("hex").toUpperCase()}function o(e){var t=Object.keys(e);t=t.sort();var r={};t.forEach(function(t){r[t.toLowerCase()]=e[t]});var n="";for(var o in r)n+="&"+o+"="+r[o];return n=n.substr(1)}function s(e,t){var r="<xml>";return r+="<appid>"+e.appid+"</appid>",r+="<body>"+e.body+"</body>",r+="<mch_id>"+e.mch_id+"</mch_id>",r+="<nonce_str>"+e.nonce_str+"</nonce_str>",r+="<notify_url>"+e.notify_url+"</notify_url>",r+="<out_trade_no>"+e.out_trade_no+"</out_trade_no>",r+="<spbill_create_ip>"+e.spbill_create_ip+"</spbill_create_ip>",r+="<total_fee>"+e.total_fee+"</total_fee>",r+="<trade_type>"+e.trade_type+"</trade_type>",r+="<sign>"+t+"</sign>",r+="</xml>"}function i(){return Math.random().toString(36).substr(2,15)}function a(e){return parseInt(e/1e3)+""}function c(e,t){var r=t.split("<"+e+">");if(r.length>1){var n=r[1].split("</"+e+">");if(n.length>0)return n[0]}return null}function u(e){if(e){var t=e.split("[");if(t&&t.length>2){var r=t[2].split("]");if(r&&r.length>0)return r[0]}}return null}var p=r(0),d=p.getLogger("ServiceWX"),f=r(13);f.Promise=r(1);var l=r(4),m=(r(7),r(8)),g=process.env,y=g.wxsecret,v={appid:g.wxappid,mch_id:g.wxmch_id,body:g.wxbody,notify_url:g.wxnotify_url,trade_type:"APP"},h={appid:g.wxappid,partnerid:g.wxmch_id},_={method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"}},b=r(5),x=[parseInt(g.feebig),parseInt(g.feemiddle),parseInt(g.feesmall)];t.createPreOrder=function(e,t,r,o){var p=Date.now(),g=m.v1().replace(/-+/g,""),y=i(),w=x[t]*r+"",j={_id:g,openid:e,type:t,num:r,date:p,platform:"wx",fee:w,stat:3};return j=JSON.stringify(j),b.SetAndOutRemove("dw:pre:order:"+g,j,36e3).then(function(e){if(!e)return{code:1,msg:"预存储订单失败"};v.nonce_str=y,v.out_trade_no=g,v.total_fee=w,v.spbill_create_ip=o;var t=s(v,n(v));return console.log(t),f("https://api.mch.weixin.qq.com/pay/unifiedorder",l.assign(_,{body:t})).then(function(e){return 200===e.status&&e.text()}).then(function(e){if(e){console.log("这是微信的统一下单方法https返回",e);var t=c("prepay_id",e);if(!(t=u(t)))return{code:1,msg:"prepay_id is null"};var r=a(p);h.nonce_str=y,h.package="Sign=WXPay",h.prepayid=t,h.timestamp=r;var o=n(h);return{code:0,out_trade_no:g,nonce_str:y,prepay_id:t,timeStamp:r,paySign:o}}return{code:1,msg:"创建订单失败-2",err:res.status}}).error(function(e){return{code:1,msg:"fetch error",err:e}})}).error(function(e){return d.error("保存订单失败："+e),{code:1,msg:"保存订单失败",err:e}})};var w=r(6)},function(e,t,r){"use strict";var n=r(0),o=n.getLogger("ServicePayWeChat"),s=r(13);s.Promise=r(1);var i=r(4),a=(r(7),r(8)),c=r(10).WXUtils,u=r(5),p=process.env.wxTinyappid,d=process.env.wxTinysecret,f=process.env.wxTinymchid,l=process.env.wxTinyspBillCreateIp,m=process.env.wxTinynotify_url,g=process.env.wxTinykey,y="https://api.weixin.qq.com/sns/jscode2session?appid="+p+"&secret="+d,v={method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"}};t.onlogin=function(e){return console.log(e),s(y+"&js_code="+e+"&grant_type=authorization_code").then(function(e){return 200==e.status?i.assign(e.json(),{code:0}):{code:1,msg:"return code:"+e.status}}).error(function(e){return{code:1,msg:"unknown",err:e}})};var h=[2e3,1e3,500];t.createPreOrder=function(e,r,n){return t.mockCreatePreOrder(e,r,n)},t.mockCreatePreOrder=function(e,t,r){var n=a.v1(),d=Date.now(),y="dilver-water-"+n,_={_id:y,openid:e,type:t||0===t?t:1,num:r>0&&2e3>r?r:1,date:d,stat:3};return console.log(1),_=JSON.stringify(_),u.SetAndOutRemove("dw:pre:order:"+y,_,36e3).then(function(r){if(!r)return{code:1,msg:"预存储订单失败"};console.log(2);var n=c.createNonceStr(),o=c.createTimeStamp(d),a={appid:p,mch_id:f,nonce_str:n,body:"惠民订水付款",attach:"惠民订水付款",out_trade_no:y,total_fee:h[t],spbill_create_ip:l,notify_url:m,trade_type:"JSAPI",openid:e};console.log(3);var u=c.createFormData(a,g);return s("https://api.mch.weixin.qq.com/pay/unifiedorder",i.assign(v,{body:u})).then(function(e){return 200===e.status&&e.text()}).then(function(e){if(console.log(4),e){var t=c.getXMLNodeValue("prepay_id",e);t=c.getPrepayID(t),console.log(5);var r=c.getPreSign({appId:p,nonceStr:n,package:"prepay_id=wx201411101639507cbf6ffd8b0779950874",signType:"MD5",timeStamp:o},g);return console.log(6),{code:0,appId:p,timeStamp:o,nonceStr:n,signType:"MD5",package:"wx201411101639507cbf6ffd8b0779950874",paySign:r}}return{code:1,msg:"创建订单失败-2",err:res.status}}).error(function(e){return{code:1,msg:"fetch error",err:e}})}).error(function(e){return o.error("保存订单失败："+e),{code:1,msg:"保存订单失败",err:e}})}},function(e,t,r){"use strict";t.createNonceStr=function(){return Math.random().toString(36).substr(2,15)},t.createTimeStamp=function(e){return parseInt(e/1e3)+""};var n=r(4),o=r(7),s={method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"}};t.GetOpts=function(e){return n.assign(s,{body:o.stringify(e)})}},function(e,t,r){"use strict";function n(e){var t=Object.keys(e);t=t.sort();var r={};t.forEach(function(t){r[t.toLowerCase()]=e[t]});var n="";for(var o in r)n+="&"+o+"="+r[o];return n=n.substr(1)}function o(e){var t=Object.keys(e);t=t.sort();var r={};t.forEach(function(t){r[t]=e[t]});var n="";for(var o in r)n+="&"+o+"="+r[o];return n=n.substring(1)}var s=(r(4),r(6));t.createNonceStr=function(){return Math.random().toString(36).substr(2,15)},t.createTimeStamp=function(e){return parseInt(e/1e3)+""},t.getSign=function(e,t){var r=n(e);return r=r+"&key="+t,s.createHash("md5").update(r,"utf8").digest("hex").toUpperCase()},t.getPreSign=function(e,t){var r=o(e);return r=r+"&key="+t,s.createHash("md5").update(r,"utf8").digest("hex")},t.getXMLNodeValue=function(e,t){var r=t.split("<"+e+">");if(r.length>1){var n=r[1].split("</"+e+">");if(n.length>0)return n[0]}return null},t.getPrepayID=function(e){if(e){var t=e.split("[");if(t&&t.length>2){var r=t[2].split("]");if(r&&r.length>0)return r[0]}}return null},t.createFormData=function(e,r){var n="<xml>";return n+="<appid>"+e.appid+"</appid>",n+="<mch_id>"+e.mch_id+"</mch_id>",n+="<nonce_str>"+e.nonce_str+"</nonce_str>",n+="<body>"+e.body+"</body>",n+="<attach>"+e.attach+"</attach>",n+="<out_trade_no>"+e.out_trade_no+"</out_trade_no>",n+="<total_fee>"+e.total_fee+"</total_fee>",n+="<spbill_create_ip>"+e.spbill_create_ip+"</spbill_create_ip>",n+="<notify_url>"+e.notify_url+"</notify_url>",n+="<trade_type>"+e.trade_type+"</trade_type>",n+="<openid>"+e.openid+"</openid>",n+="<sign>"+t.getSign(e,r)+"</sign>",n+="</xml>"}},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t){e.exports=require("async")},function(e,t){e.exports=require("body-parser")},function(e,t){e.exports=require("body-parser-xml")},function(e,t){e.exports=require("child_process")},function(e,t){e.exports=require("cors")},function(e,t){e.exports=require("errorhandler")},function(e,t){e.exports=require("express")},function(e,t){e.exports=require("http")},function(e,t){e.exports=require("httpinvoke")},function(e,t){e.exports=require("ioredis")},function(e,t){e.exports=require("node-schedule")},function(e,t){e.exports=require("os")}]);