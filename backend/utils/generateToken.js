import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (user,res) => {
    //jwt token=payload+signature+header
    const payload = {
        userId: user._id,
    }
    const options={
        expiresIn: '30d',
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);

    //Set JWT as HTTP-Only cookie
    res.cookie('access_token',token,{
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30*24*60*60*1000, //30day in milisecond
    });
}

export default generateTokenAndSetCookie;