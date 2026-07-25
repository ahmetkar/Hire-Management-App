import express from 'express';
import {errorMiddleware}  from "@hrmanagement/error-handler"
import router from './routes/management.routes'
import cors from "cors"
import cookieParser from 'cookie-parser';
import { verifyInternalRequest } from './middlewares/verify.middleware';
import { JobAppCreatedConsumerShutdown,startKafkaJobAppCreatedConsumer } from './consumers/jobAppCreated.consumer';
import { JobAppApprovedConsumerShutdown, startKafkaJobAppApprovedConsumer } from './consumers/jobAppApproved.consumer';
import { JobAppDeniedConsumerShutdown, startKafkaJobAppDeniedConsumer } from './consumers/jobAppDenied.consumer';
import "./workers/management.worker"
import {RedisClient} from './configs/redis';
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


app.get("/api-health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "management-service",
        status: "UP",
        timestamp: new Date().toISOString()
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


const port = process.env.PORT || 3332;
const server = app.listen(port, async () => {
  try {
  await startKafkaJobAppCreatedConsumer();
  await startKafkaJobAppApprovedConsumer();
  await startKafkaJobAppDeniedConsumer();

  }catch(error){
    console.error("Kafka consumerlar başlatılamadı",error)
  }
  console.log(`Listening at ${port}`);
});
server.on('error', console.error);



server.on("SIGINT", async () => {
  try {
  await JobAppCreatedConsumerShutdown();
  await JobAppApprovedConsumerShutdown();
  await JobAppDeniedConsumerShutdown();
  await RedisClient.closeConnection();
  }catch(error){
    console.error("Consumer kapatılırken hata verdi",error)
  }
});

server.on("SIGTERM", async () => {
   try {
  await JobAppCreatedConsumerShutdown();
  await JobAppApprovedConsumerShutdown();
  await JobAppDeniedConsumerShutdown();
  await RedisClient.closeConnection();
  }catch(error){
    console.error("Consumer kapatılırken hata verdi",error)
  }
});



