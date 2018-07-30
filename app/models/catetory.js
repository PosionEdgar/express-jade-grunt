var mongoose = require('mongoose');
var CatetorySchema = require('../schemas/catetory.js'); //引入'../schemas/movie.js'导出的模式模块

// 编译生成movie模型
var Catetory = mongoose.model('Catetory', CatetorySchema);

// 将movie模型[构造函数]导出
module.exports = Catetory;