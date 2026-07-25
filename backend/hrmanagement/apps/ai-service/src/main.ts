

import express from 'express';
import {errorMiddleware}  from "@hrmanagement/error-handler"
import router from './routes/ai.routes'
import cors from "cors"
import cookieParser from 'cookie-parser';
import { verifyInternalRequest } from './middlewares/verify.middleware';
import "./workers/ai.worker"
import "./workers/elastic.worker"
import "./workers/aisave.worker"
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
app.use(express.json({limit:"2mb"}))


app.get("/health", (req, res) => {
  res.status(200).json({
    service: "ai-service",
    status: "ok"
  });
});

app.use("/",router)


app.use(errorMiddleware)

app.use(verifyInternalRequest)


client.collectDefaultMetrics();

app.get("/metrics", async (_, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
});

const port = process.env.PORT || 3334;
const server = app.listen(port, () => {
  console.log(`Listening at ${port}/api`);
});
server.on('error', console.error);
