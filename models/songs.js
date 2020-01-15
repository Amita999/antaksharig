const mongoose = require('mongoose');
let uid = require('uid');
let Schema = new mongoose.Schema({
"title":{type:String,required:true},
"firstword":{type:String,required:true},
"lastword":{type:String,required:true},
"identifier":{type: String, required:true},
"lastUpdated":{type:Date,default:function(){
    return Date.now();
}},
"Song":{
"link":{type:String,required:true},
"clipBegin":{type:String,required:true},
"clipEnd":{type:String,required:true},
"Ttl":{type:String,required:true}
}
}
);
var Songs = mongoose.model('Songs',Schema);
module.exports={Songs};