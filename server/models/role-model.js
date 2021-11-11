const{Schema, model} = require('mongoose');

const RoleSchema = new Schema({
    value:{type:String, unique: true, default: 'User'}
})

module.exports = model('Role',RoleSchema);