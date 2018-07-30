var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CommentSchema = new Schema({
    movie: { type: ObjectId, ref: 'Movie' },
    from: { type: ObjectId, ref: 'User' },
    reply: [{
        from: { type: ObjectId, ref: 'User' },
        to: { type: ObjectId, ref: 'User' },
        content: String
    }],
    content: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
}, {
    usePushEach: true
});
//mongoose很早之前版本就合并了$push和$pushAll，然后mongoose3.6取消了$pushAll，所以解决方法要么版本降级3.4，要么升级5.0 rc2。
//二：new mongoose.Schema添加第二个参数{usePushEach:true} 
// var ObjectId = mongoose.Schema.Types.ObjectId
CommentSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }

    next()
})

CommentSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function(id, cb) {
        return this
            .findOne({ _id: id })
            .exec(cb)
    }
}

module.exports = CommentSchema