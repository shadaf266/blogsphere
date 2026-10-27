import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {notFound,errorHandler} from './middleware/errorHandler.js';
import connectDB from './config/db.js';
const app = express();
app.use(express.json());
app.use(cors({origin:process.env.CLIENT_URL,credentials:true}));

app.get('/api/v1/health',(req,res)=>{
  res.json({
     success: true,
     uptime: process.uptime(),
     timestamp: new Date().toISOString(),
     database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(()=>{
   app.listen(PORT,()=>{
     console.log(`Server running on http://localhost:${PORT}`);
   });
});