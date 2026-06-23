/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */



import express from 'express';
import {errorMiddleware}  from "@hrmanagement/error-handler"
import router from './routes/staff.routes';
import cors from "cors"
import cookieParser from 'cookie-parser';

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
    service: "staff-service",
    status: "ok"
  });
});

app.use("/",router)


app.use(errorMiddleware)


const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
