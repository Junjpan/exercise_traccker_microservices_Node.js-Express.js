let mongoose=require("mongoose");

let exerciseSchema=mongoose.Schema({
userid:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true
},
duration:{
    type:Number,
    required:true
},
date:{
    type:String,
    required:true
}
})

let Exercise=module.exports=mongoose.model("Exercise",exerciseSchema);