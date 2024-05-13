const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {type: String, required: true, maxLength: 500},
    timestamp: {type: Date, required: true},
    body: {type: String, required: true, maxLength: 50000},
    userId: {type: Schema.Types.ObjectId, ref: 'Users'},
    comments: {type: Schema.Types.ObjectId, ref: 'Comments'}
})

module.exports = mongoose.model('Posts', PostSchema)