const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    comment: {type: String, required: true, maxLength: 1000},
    userId: {type: Schema.Types.ObjectId, ref: 'Users'},
    timestamp: {type: Date, required: true},
    postId: {type: Schema.Types.ObjectId, ref: 'Posts'},
})

CommentSchema.virtual('timestamp_formatted').get(function () {
    if(DateTime.fromJSDate(this.timestamp).isValid){
        return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_FULL)
    }else{
        return 'N/A'
    }
})


module.exports = mongoose.model('Comments', CommentSchema);