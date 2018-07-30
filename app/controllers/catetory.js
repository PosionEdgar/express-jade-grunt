var Catetory = require('../models/catetory.js'); // 载入mongoose编译后的模型movie


// admin page 后台录入页
exports.new = function(req, res) {
    res.render('catetory_admin', {
        title: 'i_movie 后台分类录入页',
        catetory: {}
    });
};


// admin post movie 后台录入提交
exports.save = function(req, res) {
    var _catetory = req.body.catetory;

    var catetory = new Catetory(_catetory);
    catetory.save(function(err, catetory) {
        if (err) {
            console.log(err);
        }
        res.redirect('/admin/catetory/list');
    });
};

//list
exports.list = function(req, res) {

    Catetory
        .find()
        .populate({
            path: 'movies',
            options: { limit: 6 }
        })
        .exec(function(err, catetories) {
            if (err) {
                console.log(err)
            }
            res.render('catetorylist', {
                title: 'movie 分类列表页',
                catetories: catetories
            })
        })

};