var Movie = require('../models/movie.js'); // 载入mongoose编译后的模型movie
var Catetory = require('../models/catetory.js'); // 载入mongoose编译后的模型movie


// index page 首页
exports.index = function(req, res) {
    Catetory
        .find({})
        .populate({ path: 'movies', options: { limit: 6 } })
        .exec(function(err, catetories) {
            if (err) {
                console.log(err)
            }
            console.log(catetories.movies)
            res.render('index', {
                title: 'imooc 首页',
                catetories: catetories
            })
        })
}

//search
exports.search = function(req, res) {
    var catId = req.query.cat;
    var page = parseInt(req.query.p, 10) || 0;
    var q = req.query.q;
    var count = 2;
    var index = page * 2;

    if (catId) {
        Catetory
            .find({ _id: catId })
            .populate({
                path: 'movies',
                select: 'title poster'
            })
            .exec(function(err, catetories) {
                if (err) {
                    console.log(err)
                }
                var catetory = catetories[0] || {};
                var movies = catetory.movies || [];
                var results = movies.slice(index, index + count)
                res.render('results', {
                    title: 'imooc 结果列表页面',
                    keyword: catetory.name,
                    currentPage: (page + 1),
                    query: 'cat=' + catId,
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                })
            })
    } else {
        Movie
            .find({ title: new RegExp(q + '.*') })
            .exec(function(err, movies) {
                if (err) {
                    console.log(err)
                }

                var results = movies.slice(index, index + count)

                res.render('results', {
                    title: 'imooc 结果列表页面',
                    keyword: q,
                    currentPage: (page + 1),
                    query: 'q=' + q,
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                })
            })
    }



}