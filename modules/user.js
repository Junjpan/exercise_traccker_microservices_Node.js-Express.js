let mongoose=require("mongoose");

let userSchema=mongoose.Schema({
username:{
    type:String,
    required:true
},
userid:{
    type:String,
    required:true
},
count:Number
})

let User=module.exports=mongoose.model("User",userSchema);