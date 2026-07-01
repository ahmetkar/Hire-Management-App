import { Request,Response,NextFunction } from "express";
import jwt,{JwtPayload} from "jsonwebtoken"
import redis from "../config/redis"


type Role = "user" | "admin" | "staff" ;

interface TokenPayload extends JwtPayload {
  id: string;          // userId
  role: Role;
  sessionId: string;
}

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
    sessionId: string;
  };
  token?: string;
}

export const verifyToken = async (req:any,res:any,next:NextFunction) => {


    try {

   const token = req.cookies?.access_token
    
   if(!token){
    return res.status(403).send({message:`Invalid authorization header`})
   }

   const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET as string) as TokenPayload

   if(!decoded.id || !decoded.sessionId || !decoded.role){
    console.log(decoded)  
    return res.status(403).send({message:`Invalid authorization header ${decoded.id} ${decoded.sessionId}`})
   }

   

    const redisKey = `session:${decoded.sessionId}`
    const sessionRaw = await redis.get(redisKey)

    if(!sessionRaw){
        return res.status(403).send({message:"Unauthorized"})
    }


    const session = JSON.parse(sessionRaw) as {
      id: string;
      role: Role;
      sessionId:string;
    }

    if(session.id !== decoded.id){
        return res.status(401).json({
        message: "Invalid session owner"
      });
    }



      req.user = {
        id: decoded.id,
        role: decoded.role,
        sessionId: decoded.sessionId
        };
    req.token = token


    return next();
    }catch(error){
    return res.status(401).json({
      message: "Unauthorized.",
      error:error
    });
    }



}