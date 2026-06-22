/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';

import path from 'path';

import cors from "cors";
import proxy from "express-http-proxy";
import morgan from "morgan";
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

import swaggerUi from "swagger-ui-express";
import axios from "axios";
import cookieParser from "cookie-parser";
import helmet from 'helmet';


const app = express();


app.use(cors({
  origin:["http://localhost:3000"],
  allowedHeaders:['Authorization',"Content-Type"
  ],
  credentials:true
}),
);


app.use(morgan("dev"));
app.use(helmet())
app.use(cookieParser());
app.set("trust proxy",1);


const limiter = rateLimit({
  windowMs:15*60*1000,
  //max: (req:any)=>(req.user ? 1000 : 100), 
  max:1000,
  message:{error:"Too many request, please try again later"},
  standardHeaders:true,
  legacyHeaders:true,
  keyGenerator: (req:any)=> ipKeyGenerator(req.ip) // spesifik ip için rate limiter ekle,

});


const createProxy = (prefix:string,target:string) => {
    let orgurl = ""
    return proxy(target,{
      timeout:5000,
      proxyReqPathResolver(req) {
          orgurl = req.originalUrl.replace(new RegExp(`${prefix}`),"")  || "/"
          return orgurl

      },
      proxyErrorHandler:(err,res,next)=>{
        console.error(`${prefix} proxy error : `,err.message)
        res.status(502).json({
          message: `${prefix} service unavaliable (${orgurl})`
        })
      }

    })
}


app.use(limiter);


app.get('/gateway-health', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});


app.use("/auth",createProxy("/auth",process.env.AUTH_SERVICE_URL!));
app.use("/job",createProxy("/auth",process.env.JOB_SERVICE_URL!));
app.use("/staff",createProxy("/staff",process.env.STAFF_SERVICE_URL!));
app.use("/management",createProxy("/management",process.env.MANAGEMENT_SERVICE_URL!));






const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
  
});
server.on('error', console.error);

