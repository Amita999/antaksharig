const mongoose = require('mongoose');
let uSongSchema = new mongoose.Schema({
    "title":{type:String,required:true},
    "user_id":{type: String, required :true} ,
"firstword":{type:String,required:true},
"lastword":{type:String,required:true},
"identifier":{type: String, required:true},
"lastUpdated":{type:String,required:true},
"Song":{
"link":{type:String,required:true},
"clipBegin":{type:String,required:true},
"clipEnd":{type:String,required:true},
"Ttl":{type:String,required:true}
}
}
);
var uSongs = mongoose.model('uSongs',uSongSchema);
module.exports={uSongs};
