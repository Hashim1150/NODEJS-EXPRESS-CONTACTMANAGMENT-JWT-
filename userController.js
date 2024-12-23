const asyncHandler = require("express-async-handler");
require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt =require("jsonwebtoken");
const tokengen=require("../middleware/tokenGeneration");

//@public access
const registerUser = asyncHandler(async (req,res)=>{
    const {username, email, password} = req.body;
    if(!username ||!email||!password){
        res.status(400);
        throw new Error("All fields are required");
    }

   const userAvbl = await User.findOne({email})
 
    if (userAvbl) {
        res.status(400)
        throw new Error("User already exist.....please login");
    }
    // hash password and storing the hashpassword
    const hashedPassword = await bcrypt.hash(password,8)
 //   console.log("hashed password is :", hashedPassword)
    const user= await User.create({
           username,
           email,
           password : hashedPassword,
       });
    console.log(`user created ${user}`)
    if(user){
        res.status(201).json({message : "User registered",_id : user.id , email :user.email})
    } else{
        res.status(400);
        throw new Error("User data is not valid")
    }
});
//@public access
const loginUser = (async (req,res)=>{
    const {email, password}= req.body;
    if(!email || !password){
        res.status(400)
        throw new Error("all fields are required")
    }
    const user = await User.findOne({email}); // finding if user is present
    if(user &&(await bcrypt.compare(password,user.password))){
        tokengen(user,res)
      res.status(200).json({message : "login sucessfull"});
    }else{
        res.status(401);
        throw new Error("email or password not valid");
    }   
});
//@private access
const currentUser = asyncHandler(async (req,res)=>{
    res.status(200).json({message : "current user"});
});
module.exports = { registerUser , loginUser, currentUser}; 