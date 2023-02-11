const express=require("express")
const { createuser, login, getuser, updateuser } = require("../controllers/userController")
const router=express.Router()

router.post("/register",createuser)
router.post("/login",login)
router.get("/getuser",getuser)
router.put("/updateuser/:id",updateuser)
module.exports=router