import express from 'express';
import {errorMiddleware}  from "@hrmanagement/error-handler"
import router from './routes/management.routes'
import cors from "cors"
import cookieParser from 'cookie-parser';
import { verifyInternalRequest } from './middlewares/verify.middleware';
import { JobAppCreatedConsumerShutdown,startKafkaJobAppCreatedConsumer } from './consumers/jobAppCreated.consumer';
import { JobAppApprovedConsumerShutdown, startKafkaJobAppApprovedConsumer } from './consumers/jobAppApproved.consumer';
import { JobAppDeniedConsumerShutdown, startKafkaJobAppDeniedConsumer } from './consumers/jobAppDenied.consumer';

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


app.get("/health", (req, res) => {
  res.status(200).json({
    service: "management-service",
    status: "ok"
  });
});

app.use("/",router)


app.use(errorMiddleware)

app.use(verifyInternalRequest)




const port = process.env.PORT || 3332;
const server = app.listen(port, async () => {
  try {
  await startKafkaJobAppCreatedConsumer();
  await startKafkaJobAppApprovedConsumer();
  await startKafkaJobAppDeniedConsumer();

  }catch(error){
    console.error("Kafka consumerlar başlatılamadı",error)
  }
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);



server.on("SIGINT", async () => {
  try {
  await JobAppCreatedConsumerShutdown();
  await JobAppApprovedConsumerShutdown();
  await JobAppDeniedConsumerShutdown();
  }catch(error){
    console.error("Consumer kapatılırken hata verdi",error)
  }
});

server.on("SIGTERM", async () => {
   try {
  await JobAppCreatedConsumerShutdown();
  await JobAppApprovedConsumerShutdown();
  await JobAppDeniedConsumerShutdown();
  }catch(error){
    console.error("Consumer kapatılırken hata verdi",error)
  }
});



