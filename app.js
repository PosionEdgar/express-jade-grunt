var express = require('express'); // 加载express模块
var app = express(); // 启动Web服务器
var fs = require('fs');
var port = process.env.PORT || 3000; // 设置端口号：3000
var mongoose = require('mongoose'); // 加载mongoose模块
var path = require('path'); // 引入path模块的作用：因为页面样式的路径放在了bower_components，告诉express，请求页面里所过来的请求中，如果有请求样式或脚本，都让他们去bower_components中去查找
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
app.post('/formdata', multipartMiddleware, function(req, res) {

    res.send(req.body, req.files, req.files.file.path);

    console.log(req.files)

});
app.use(multipart({ uploadDir: './public/upload' })); //设置上传文件存放的地址。
var dbUrl = 'mongodb://localhost:27017/imovie';
mongoose.connect(dbUrl); // 连接mongodb本地数据库imovie
console.log('MongoDB connection success!');
/*  mongoose 简要知识点补充
 * mongoose模块构建在mongodb之上，提供了Schema[模式]、Model[模型]和Document[文档]对象，用起来更为方便。
 * Schema对象定义文档的结构（类似表结构），可以定义字段和类型、唯一性、索引和验证。
 * Model对象表示集合中的所有文档。
 * Document对象作为集合中的单个文档的表示。
 * mongoose还有Query和Aggregate对象，Query实现查询，Aggregate实现聚合。
 * */

//models loading
var models_path = __dirname + '/app/models'
var walk = function(path) {
    fs
        .readdirSync(path)
        .forEach(function(file) {
            var newPath = path + '/' + file
            var stat = fs.statSync(newPath)

            if (stat.isFile()) {
                if (/(.*)\.(js|coffee)/.test(file)) {
                    require(newPath)
                }
            } else if (stat.isDirectory()) {
                walk(newPath)
            }
        })
}
walk(models_path)

app.set('views', './app/views/pages'); // 设置视图默认的文件路径
app.set('view engine', 'jade'); // 设置视图引擎：jade
var bodyParser = require('body-parser');
// 因为后台录入页有提交表单的步骤，故加载此模块方法（bodyParser模块来做文件解析），将表单里的数据进行格式化

app.use(bodyParser.urlencoded({ extended: true }));

app.use(multipart())

var session = require('express-session'); //express4 :如果使用session、需要单独包含这个模块
var cookieParser = require('cookie-parser'); //如果使用cookie、需要显示包含这个模块

var mongoStore = require('connect-mongo')(session);

var logger = require('morgan');

app.use(cookieParser());
app.use(session({
    secret: 'imovie',
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));
//打开控制台调试中心
if ('development' === app.get('env')) {
    app.set('showStackError', true);
    app.use(logger(':method :url :status'))
    app.locals.pretty = true;
    mongoose.set('debug', true)
}
//引入路由
require('./config/routes')(app)

app.locals.moment = require('moment'); // 载入moment模块，格式化日期

var serveStatic = require('serve-static'); // 静态文件处理
app.use(serveStatic('public')); // 路径：public


app.listen(port); // 监听 port[3000]端口
console.log('i_movie start on port' + port);