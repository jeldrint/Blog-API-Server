const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    user_name: {type: String, required: true, maxLength: 100},
    password: {type: String, required: true, maxLength: 100},
    isAdmin: {type: Boolean, required: true}
})

UserSchema.virtual('url').get(function (){
    return `/techy-blog/${this.user_name}`
})

module.exports = mongoose.model('Users', UserSchema)