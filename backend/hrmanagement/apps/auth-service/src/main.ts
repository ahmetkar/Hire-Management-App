

import express from 'express';
import {errorMiddleware}  from "@hrmanagement/error-handler"
import router from './routes/auth.routes';
import cors from "cors"
import cookieParser from 'cookie-parser';
import { verifyInternalRequest } from './middlewares/verify.middleware';
import { RedisClient } from './config/redis';
import dotenv from "dotenv"
import client from "prom-client"

const app = express();

dotenv.config({path:`.env${process.env.NODE_ENV || ""}`})

const clientUrl = process.env.CLIENT_URL!=undefined ? process.env.CLIENT_URL : ""

app.use(cors({
  origin:[clientUrl],
  allowedHeaders:['Authorization',"Content-Type"
  ],
  credentials:true
}),
);

app.use(cookieParser()) 
app.use(express.json())

app.use("/",router)

app.use(errorMiddleware)

app.use(verifyInternalRequest)




app.get("/api-health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "auth-service",
        status: "UP",
        timestamp: new Date().toISOString()
    });
});



client.collectDefaultMetrics();

app.get("/metrics", async (_, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
});


const port = process.env.PORT || 3330;
const server = app.listen(port, async () => { 
  console.log(`Listening at ${port}`);
});
server.on('error', console.error);


server.on("SIGINT", async () => {
  try {
  await RedisClient.closeConnection();

  }catch(error){
    console.error(" hata verdi",error)
  }
});

server.on("SIGTERM", async () => {
   try {

  await RedisClient.closeConnection();

  }catch(error){
    console.error(" hata verdi",error)
  }
});