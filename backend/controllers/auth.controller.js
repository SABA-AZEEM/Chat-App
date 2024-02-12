import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie
 from "../utils/generateToken.js";

//Signup functionality
const signUp = async (req,res) => {
    try{
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if( password !== confirmPassword ){
            return res.status(400).json({error:"Password don't match"});
        }

        const user = await User.findOne({username});

        if( user ){
            return res.status(400).json({error:"User already exist!"});
        }

        //hash password here
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            password : hashedPassword,
            gender,
            profilePic: gender === 'male'? boyProfilePic:girlProfilePic
        });

        if(newUser){
            //Generate jwt token here
            generateTokenAndSetCookie(newUser,res);

            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                username:newUser.username,
                profilePic:newUser.profilePic,
            });
        }else{
            res.status(400).json({error:"Invalid user data"});
        }
    }catch(error){
        console.log("Error in signup controller",error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

//Login functionality
const logIn =async (req,res) => {
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid username or password!"});
        }

        generateTokenAndSetCookie(user,res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });

    }catch(error){
        console.log("Error in login Controller",error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

//Logout functionality
const logOut = (req,res) => {
    try{
        res.cookie("access_token","",{maxAge:0});
        res.status(200).json({message:"Logged out successfully!"});
    }catch(error){
        console.log("Error in logout controller",error.message);
        res.status(500).json({error:"Internal server error!"});
    }
}

export {signUp, logIn, logOut};