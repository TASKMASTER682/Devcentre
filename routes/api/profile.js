const express=require("express");
const request=require("request");
const config=require("config");
const router=express.Router();
const auth=require("../../middleware/auth");
const {check,validationResult}=require('express-validator');

const Profile=require('../../models/Profile');
const User=require("../../models/User");
const Post=require("../../models/Post");



//@route  Get api/profile/me
//does    get current users profile
//@acess Private
router.get("/me",auth,async (req,res) =>{
    try{
        const profile= await Profile.findOne({user:req.user.id}).populate("user",
        ['name','avatar']);
       if(!profile) {
           return res.status(400).json({msg:"There is no profile of this User"})
       }
       res.json(profile);
         
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error")

    }
});
//@route  Post api/profile
//does    create or update users profile
//@acess Private
router.post('/',[auth,[
    check('status','status is required')
    .not()
    .isEmpty(),
   check('skills','Skills are required')
   .not()
   .isEmpty() 
]],async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});

    }
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin,

    }=req.body;
    //build profile object
    const profileFields={};
    profileFields.user=req.user.id;
    if(company) profileFields.company=company;
    if(website) profileFields.website=website;
    if(location) profileFields.location=location;
    if(bio) profileFields.bio=bio;
    if(status) profileFields.status=status;
    if(githubusername) profileFields.githubusername=githubusername;
    //each skill will be splitted by comma automatically
    if(skills){
        profileFields.skills=skills.split(',')
        .map(skills=>skills.trim());
    }

    //Build social object
    profileFields.social={}
    if(youtube) profileFields.social.youtube=youtube;
    if(twitter) profileFields.social.twitter=twitter;
    if(instagram) profileFields.social.instagram=instagram;
    if(linkedin) profileFields.social.linkedin=linkedin;
    if(facebook) profileFields.social.facebook=facebook;
    
    try{
        let profile= await Profile.findOne({use:req.user.id});
        if(profile){
            //Update
            profille=await Profile.findOneAndUpdate({user:user.id},
                {$set:profileFields},
                {new:true}
                );
                return res.json(profile);
                

        }
        //create
        profile=new Profile(profileFields);
        await profile.save();
        res.json(profile);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');

    }

});
//@route  Get api/profile
//does   get all profiles
//@acess Public
router.get("/",async (req,res)=>{
try {
    const profiles=await Profile.find().populate('user',['name','avatar']);
    res.json(profiles);
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server error')
    
}
});
//@route  Get api/profile/users/user:id
//does   get  profiles by user id
//@acess Private
router.get("/user/:user_id",async (req,res)=>{
    try {
        const profile=await Profile.findOne({user:req.params.user_id}).populate('user',
        ['name','avatar']);
        if(!profile) return res.status(400).json({msg:"There is no profile for this user"});
        //otherwise
        else
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind==='ObjectId'){
            return res.status(400).json({msg:"Profile not found"});
        }
        res.status(500).send('Server error')
        
    }
    });

//@route  Delete api/profile
//does   delete user, profile and posts
//@acess Private
router.delete("/",auth,async (req,res)=>{
    try {
        // remove users posts

         await Post.deleteMany({user:req.user.id })


        //Remove profile

        await Profile.findOneAndRemove({user:req.user.id});
        //remove user
        await User.findOneAndRemove({_id:req.user.id});
        res.json({msg:"user deleted"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
        
    }
    });

//@route  Put api/profile/experiance
//does   add profile experiance
//@acess Private
router.put("/experience",[auth,[
    check('title','Title is required').not().isEmpty(),
    check('company','company is required').not().isEmpty(),
    check('from','From date is required')
]
],
async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array() });
    }
    //extracting fields from db and body
    const {title,
        company,
        location,
        from,
        to,
        current,
        description

}=req.body;
//the below is actually key value pairs like title:title,the names are same so we write like this
const newExp={
    title,
    company,
    location,
    from,
    to,
    current,
    description
}
try {
    const profile=await Profile.findOne({user:req.user.id});
    profile.experience.unshift(newExp);
    await profile.save();
    res.json(profile);

    
} catch (err) {
    console.error(err.message);
    res.status(500).send('server error')
    
}
 
});
//@route  Delete api/profile/experiance
//does   delete profile experiance
//@acess Private
router.delete("/experience/:exp_id",auth,async (req,res)=>{
    try {
        const profile=await Profile.findOne({user:req.user.id});
        //get remove index
        const removeIndex=profile.experience.map(item=>item.id).indexOf
        (req.params.exp_id);
        profile.experience.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
        
    }
});
//@route  Put api/profile/education
//does   add profile education
//@acess Private
router.put("/education",[auth,[
    check('school','school info is required').not().isEmpty(),
    check('degree','degree info is required').not().isEmpty(),
    check('from','this field is required').not().isEmpty(),
    check('fieldofstudy','fieldofstudy is required').not().isEmpty()
    
]
],
async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array() });
    }
    //extracting fields from db and body
    const {school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description

}=req.body;
//the below is actually key value pairs like title:title,the names are same so we write like this
const newEdu={
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
}
try {
    const profile=await Profile.findOne({user:req.user.id});
    profile.education.unshift(newEdu);
    await profile.save();
    res.json(profile);

    
} catch (err) {
    console.error(err.message);
    res.status(500).send('server error')
    
}
 
});
//@route  Delete api/profile/education
//does   delete profile education
//@acess Private
router.delete("/education/:edu_id",auth,async (req,res)=>{
    try {
        const profile=await Profile.findOne({user:req.user.id});
        //get remove index
        const removeIndex=profile.education.map(item=>item.id).indexOf
        (req.params.edu_id);
        profile.education.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
        
    }
});

//@route  get api/profile/:username
//does   get user repos from github
//@acess Public
router.get("/github/:username",(req,res)=>{
    try {
        const options={
            uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method:'GET',
            headers:{ 'user-agent':"node.js" }
        };
        request(options,(error,response,body)=>{
            if(error) console.error(error);
            if(response.statusCode !==200){
               return res.status(404).json({msg:"No github profile found"});
            }
            res.json(JSON.parse(body))
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
        
    }
})

module.exports=router; 