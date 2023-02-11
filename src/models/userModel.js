const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    nickname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["admin","mentor","mentee"],
        required:true
    },
    guidance:{
        type:String,
        enum:["Life & personal Devlopment","Business & Entrepreneurship","Carrer & Study","Health & Sports","Creative & Arts"],
        required:true
    },
    description:{
        type:String,
        required:true
    },
    avtar:{
        type:String,
        required:true
    }

},{timestamps:true})

module.exports=new mongoose.model('User',userSchema)