const express=require("express")
const mongoose=require("mongoose")
const bodyparser=require("body-parser")
const multer=require("multer")
const route=require("../src/route/route")

let app=express()
app.use(bodyparser.json())
app.use(multer().any())
mongoose.connect("mongodb+srv://subrat_400:4iQC1DP0ZqKInrD3@cluster0.h3xeivd.mongodb.net/mentor-planet",{
    useNewUrlParser:true
}).then(()=>console.log("mongodb is connected"))
.catch((error)=>error.message)

app.use("/",route)

let port=process.env.PORT || 3000

app.listen(port ,()=>{
    console.log("express running on the port" + port)
})
