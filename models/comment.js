const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    body: {type: String, required: true, maxLength: 1000},
    userId: {type: Schema.Types.ObjectId, ref: 'Users'},
    timestamp: {type: Date, required: true} 
})

module.exports = mongoose.model('Comments', CommentSchema);