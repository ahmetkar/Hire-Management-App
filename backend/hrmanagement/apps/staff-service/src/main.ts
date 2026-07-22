
import express from 'express';
import {errorMiddleware}  from "@hrmanagement/error-handler"
import router from './routes/staff.routes';
import cors from "cors"
import cookieParser from 'cookie-parser';
import { verifyInternalRequest } from './middlewares/verify.middleware';

import { JobAppApprovedConsumerShutdown, startKafkaJobAppApprovedConsumer } from './consumers/jobAppApproved.consumer';
import "./workers/staff.worker"

const app = express();


app.use(cors({
  origin:["http://localhost:3000"],
  allowedHeaders:['Authorization',"Content-Type"
  ],
  credentials:true
}),
);

app.use(cookieParser())
app.use(express.json())

app.use(verifyInternalRequest)


app.get("/health", (req, res) => {
  res.status(200).json({
    service: "staff-service",
    status: "ok"
  });
});

app.use("/",router)


app.use(errorMiddleware)



const port = process.env.PORT || 3333;
const server = app.listen(port, async () => {
  try {

    await startKafkaJobAppApprovedConsumer();

  }catch(error){
    console.error("Kafka consumerlar başlatılamadı",error)
  }
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);




server.on("SIGINT", async () => {
  try {
  await JobAppApprovedConsumerShutdown();

  }catch(error){
    console.error("Consumer kapatılırken hata verdi",error)
  }
});

server.on("SIGTERM", async () => {
   try {

  await JobAppApprovedConsumerShutdown();

  }catch(error){
    console.error("Consumer kapatılırken hata verdi",error)
  }
});