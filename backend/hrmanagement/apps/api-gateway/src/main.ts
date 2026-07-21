
import express from 'express';
import cors from "cors";
import proxy from "express-http-proxy";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from 'helmet';
import { limiter } from './middlewares/rate-limiter.middleware';
import { verifyToken } from './middlewares/auth.middleware';
import { authorizeRoles } from './utils/authorizeRoles';
import http from "http"
import {Server} from "socket.io"

import { startQueueEvents } from './queueEvents/queueEvent';

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

app.use(limiter);


//Original url localhost:4000/auth/login şeklinde gelebelir burada auth u sil /login kalsın baştaki url i öyle değiştir.

const createProxy = (prefix:string,target:string) => {
    let orgurl = ""
    return proxy(target,{
      timeout:500000,
      proxyReqPathResolver(req) {
        //orgUrl i gidecek url e çevirirken prefixi kullanma
          orgurl = req.originalUrl.replace(new RegExp(`${prefix}`),"")  || "/"
          return orgurl

      },
      proxyErrorHandler:(err,res,next)=>{
        console.error(`${prefix} proxy error : `,err.message)
        res.status(502).json({
          message: `${prefix} service unavaliable (${orgurl})`
        })
      },
      proxyReqOptDecorator: (proxyReqOpts,srcReq:any)=>{
        delete proxyReqOpts.headers?.["x-user-id"];
        delete proxyReqOpts.headers?.["x-user-role"];
        delete proxyReqOpts.headers?.["x-session-id"];

        proxyReqOpts.headers = {
        ...proxyReqOpts.headers,
        "x-internal-api-key": process.env.INTERNAL_API_KEY as string,
       };

        if(srcReq.user){
          proxyReqOpts.headers = {
            ...proxyReqOpts.headers,
            "x-user-id": srcReq.user.id,
            "x-user-role":srcReq.user.role,
            "x-session-id":srcReq.user.sessionId,
          }

        }
        return proxyReqOpts
        
      }

    })
}



app.get('/gateway-health', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});

app.use("/auth/get-user-by-filter",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/auth",process.env.AUTH_SERVICE_URL!!));
app.use("/auth/user-delete/:id/",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/auth",process.env.AUTH_SERVICE_URL!!));
app.use("/auth/user-update",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/auth",process.env.AUTH_SERVICE_URL!!));
app.use("/auth/get-users",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/auth",process.env.AUTH_SERVICE_URL!!));
app.use("/auth/get-user/:id",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/auth",process.env.AUTH_SERVICE_URL!!));
app.use("/auth/user-register",verifyToken,authorizeRoles(["admin"]),createProxy("/auth",process.env.AUTH_SERVICE_URL!!));
app.use("/auth/get-logged-user",verifyToken,authorizeRoles(["admin"]),createProxy("/auth",process.env.AUTH_SERVICE_URL!!));
app.use("/auth",createProxy("/auth",process.env.AUTH_SERVICE_URL!));



app.use("/job/get-job-by-filter",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/job",process.env.JOB_SERVICE_URL!));



app.use("/job/job-create",verifyToken,authorizeRoles(["admin"]),createProxy("/job",process.env.JOB_SERVICE_URL!));
app.use("/job/job-delete/:id",verifyToken,authorizeRoles(["admin"]),createProxy("/job",process.env.JOB_SERVICE_URL!));
app.use("/job/get-job-application-by-filter",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/job",process.env.JOB_SERVICE_URL!));
app.use("/job/get-one-application/:id",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/job",process.env.JOB_SERVICE_URL!));
app.use("/job/get-all-application",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/job",process.env.JOB_SERVICE_URL!));
app.use("/search-all-application",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/job",process.env.JOB_SERVICE_URL!));


app.use("/job/job-update",verifyToken,authorizeRoles(["admin"]),createProxy("/job",process.env.JOB_SERVICE_URL!));
app.use("/job/deny-application",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/job",process.env.JOB_SERVICE_URL!));
app.use("/job/approve-application",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/job",process.env.JOB_SERVICE_URL!));

app.use("/job/create-department",verifyToken,authorizeRoles(["admin"]),createProxy("/job",process.env.JOB_SERVICE_URL!));
app.use("/job/update-department",verifyToken,authorizeRoles(["admin"]),createProxy("/job",process.env.JOB_SERVICE_URL!));
app.use("/job/delete-department/:id",verifyToken,authorizeRoles(["admin"]),createProxy("/job",process.env.JOB_SERVICE_URL!));
app.use("/job/get-all-departments",verifyToken,authorizeRoles(["admin"]),createProxy("/job",process.env.JOB_SERVICE_URL!));
app.use("/job/get-department/:id",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/job",process.env.JOB_SERVICE_URL!));


app.use("/job",createProxy("/job",process.env.JOB_SERVICE_URL!));



app.use("/staff//staff-delete",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/staff",process.env.STAFF_SERVICE_URL!));
app.use("/staff/staff-update",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/staff",process.env.STAFF_SERVICE_URL!));
app.use("/staff/staff-create",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/staff",process.env.STAFF_SERVICE_URL!));
app.use("/staff/get-staff/:id",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/staff",process.env.STAFF_SERVICE_URL!));
app.use("/staff/get-all-staff",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/staff",process.env.STAFF_SERVICE_URL!));
app.use("/staff/get-user-and-staff/:id",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/staff",process.env.STAFF_SERVICE_URL!));
app.use("/staff/get-all-user-and-staff",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/staff",process.env.STAFF_SERVICE_URL!));
app.use("/staff/get-user-and-staff-by-filter",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/staff",process.env.STAFF_SERVICE_URL!));
app.use("/staff/get-staff-by-filter",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/staff",process.env.STAFF_SERVICE_URL!));


app.use("/staff",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/staff",process.env.STAFF_SERVICE_URL!));
app.use("/management",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/management",process.env.MANAGEMENT_SERVICE_URL!));
app.use("/ai-service",verifyToken,authorizeRoles(["admin","staff"]),createProxy("/ai-service",process.env.AI_SERVICE_URL!));



const server1 = http.createServer(app)


export const io = new Server(server1,{cors:{
  origin:"http://localhost:3000"
}})

io.on("connection",async (socket)=>{
  console.log("Socket bağlandı",socket.id)

  socket.on("join-job",async (jobId)=>{
    socket.join(jobId)
    console.log(socket.id," katıldı ",jobId)
  
  })
})

startQueueEvents(io)

const port = process.env.PORT || 4000;
const server = server1.listen(port, async () => {

  console.log(`Listening at http://localhost:${port}/api`);
  
});
server.on('error', console.error);

