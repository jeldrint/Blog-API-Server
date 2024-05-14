const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const PostSchema = new Schema({
    title: {type: String, required: true, maxLength: 500},
    timestamp: {type: Date, required: true},
    body: {type: String, required: true, maxLength: 50000},
    userId: {type: Schema.Types.ObjectId, ref: 'Users'},
    comments: {type: Schema.Types.ObjectId, ref: 'Comments'}
})

PostSchema.virtual('date_formatted').get(function () {
    if(DateTime.fromJSDate(this.timestamp).isValid){
        return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_FULL)
    }else{
        return 'N/A'
    }
})

module.exports = mongoose.model('Posts', PostSchema)