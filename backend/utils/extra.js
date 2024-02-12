import jwt from 'jsonwebtoken';

const generateToken = (user,res) => {
  //Create jwt token(jwt===payload+signature+header)
    //signature===header+payload+secret-key
    const payload = {
        userId: user._id,
        userEmail: user.email,
        //Add other claims as needed
    }
    const options={
        expiresIn: '30d',
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);

    // Set JWT as HTTP-Only cookie
    res.cookie('access_token',token,{
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30*24*60*60*1000, //30 days in mili-sec
    });
}

export default generateToken