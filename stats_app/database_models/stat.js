const mongoose = require('mongoose')

const statSchema = new mongoose.Schema({
    year:{
        type:Number
    } ,
    state:{
        type:String
    } ,
    bmi:{
        type:String
    } ,
    gender:{
        type:String
    } ,
    sample_size:{
        type:Number
    } ,



});

const Stat = mongoose.model('Stat', statSchema)

module.exports = Stat
