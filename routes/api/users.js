const express=require("express");
const router=express.Router();
const gravatar=require("gravatar");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const config= require("config");
const {check,validationResult}=require("express-validator");

const User=require('../../models/User');
//@route  post api/users
//does    test route
//@acess Public
//till try it is standard code to use vexpress validation
router.post('/',[check('name','Name is required')
.not()
.isEmpty(),
check('email','Please include a valid email')
.isEmail(),
check('password','please Enter a valid Password with 6 or more characters')
.isLength({min:6})
],
async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {name,email,password}=req.body;
    
    try{
         //see if user exist
         let user =await User.findOne({email});
         if(user){
             return res.status(400).json({errors:[{msg:'User already exist'}]});
         }
         //Get users gravatar
         const avatar=gravatar.url(email,{
             s:'200',
             r:'pg',
             d:'mm'
         })
//extracting fields from user schema
         user=new User({
             name,
             email,
             avatar,
             password
         })
         //encrypt passeord
         const salt=await bcrypt.genSalt(10);

         user.password= await bcrypt.hash(password,salt);
         await user.save();
         //return jsonwebtoken
         const payload={
             user:{
                 id:user.id
             }
         };
         jwt.sign(
             payload,
             config.get('jwtSecret'),
         {expiresIn:360000},
         (err,token)=>{
             if(err) throw err;
             res.json({token});
         }
         );
        
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
}

   
      


}
);

    
module.exports=router; 