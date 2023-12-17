const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require("../validation");
const { schema } = require("@hapi/joi/lib/compile");
const JWT = require("jsonwebtoken");

router.get('/', (req,res)=>{
    res.send("inside the users")
});
//regis
router.post('/register',async (req,res)=>{
    //validate user 
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    //check the email 
    const emailExist = await User.findOne({email : req.body.email});
    if(emailExist) return res.status(400).send("email already exist");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

   const user = new User({
    name : req.body.name,
    email : req.body.email,
    password : hashedPassword,
   });

   try {
    const savedUser = await user.save();
    res.status(200).send({user: savedUser});
   } catch (err) {
    res.status(400).send({status: "failed", msg:err});
   }
});

//login
router.post('/login', async (req, res)=>{
  //validate
   const {error}=loginValidation(req.data);
   if(error) return res.status(400).send(error.details[0].message); 
   
    //check email
    const user = await User.findOne({email : req.body.email});
    if(!user) return res.status(400).send("invalid email");

    //check password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('password invalid');

    //create a token for user
    const token = JWT.sign({_id : user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token',token).send(token);

});

module.exports=router;