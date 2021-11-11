const{Schema, model} = require('mongoose');

const ComputerSchema = new Schema({
    computerId: {type:String, unique: true, required: true},
    computerState: {type:String, required: true},
})

module.exports = model('Computer',ComputerSchema);