const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    user_name: {type: String, required: true, maxLength: 100},
    password: {type: String, required: true, maxLength: 100},
    isAdmin: {type: Boolean}
})

UserSchema.virtual('url').get(function (){
    return this._id
})

module.exports = mongoose.model('Users', UserSchema)