const{Schema, model,Types} = require('mongoose');

const AuditoriaSchema = new Schema({
    auditoriaName: {type:String, unique: true, required: true},
    computers:[{type:Types.ObjectId, ref: 'Computer'}]
})

module.exports = model('Auditoria',AuditoriaSchema);