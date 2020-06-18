const express=require("express");
const router=express.Router();

//@route  Get api/posts
//does    test route
//@acess Public
router.get("/",(req,res) =>res.send("Posts route"));

module.exports=router; 