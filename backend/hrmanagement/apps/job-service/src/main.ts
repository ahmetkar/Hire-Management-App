


import express from 'express';
import {errorMiddleware}  from "@hrmanagement/error-handler"
import router from './routers/job.routes';
import cors from "cors"
import cookieParser from 'cookie-parser';
import { verifyInternalRequest } from './middlewares/verify.middleware';


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
    service: "job-service",
    status: "ok"
  });
});

app.use("/",router)


app.use(errorMiddleware)


app.use(verifyInternalRequest)



const port = process.env.PORT || 3331;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
server.on('error', console.error);