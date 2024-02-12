import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import userRoutes from './routes/user.route.js';

import connectDB from './config/connectDB.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;



//to parse the incoming requests with JSON payloads( from req.body)
app.use(express.json());
app.use(cookieParser());

//Routes
app.use('/api/auth',authRoutes);
app.use('/api/message',messageRoutes);
app.use('/api/users',userRoutes);



//Listening the port
app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port: ${PORT}`);
})