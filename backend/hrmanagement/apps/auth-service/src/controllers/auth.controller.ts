
import { Request,Response,NextFunction } from "express";
import { validateEmailData, validateRegistirationData } from "../helpers/auth.helper";
import { AuthError, JsonWebTokenError, ValidationError } from "@hrmanagement/error-handler";
import bcrypt  from "bcryptjs"
import {prisma}  from "@hrmanagement/prisma"
import jwt from "jsonwebtoken"
import { setCookie } from "../util/setCookie";
import { clearCookie } from "../util/clearCookie";
import { publishUserLogin } from "../events/producers/userLogin.producers";
import redis from "../config/redis";
import { randomUUID } from "crypto";
import { publishUserLogout } from "../events/producers/userLogout.producers";






export const userRegister = async (req:Request,res:Response,next:NextFunction) => {

    try {
        if(req.body &&  Object.keys(req.body).length > 0){

        validateRegistirationData(req.body);
        
        const {name,email,password,role,departmentId} = req.body;

        var signupdate  = new Date().toISOString();
            
        const existingUser = await prisma.users.findUnique({where:{email:email}})

        if(existingUser){
            return next(new ValidationError("User already exists with that email"))
        }


        const hashedPassword = await bcrypt.hash(password,10)

        const user = await prisma.users.create({
            data : {name:name,email:email,password:hashedPassword,signupdate:signupdate,role:role,departmentId:departmentId}
        })

        if(user != null){
            res.status(201).json({
            success:true,
            message:"User registered succesfully !"
        });
        }else {
             return next(new ValidationError("User cannot registered"))
        }
    

        }
    }catch(error){
            return next(error);
        }


}


export const loginUser = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const sessionId = randomUUID()
        const jti = crypto.randomUUID()

        const {email,password} = req.body;
        if(!email || !password){
            return next(new ValidationError("Email and password required !"));
        }

        const user = await prisma.users.findUnique({where : {email}});
        
        if(!user){
            return next(new AuthError("User does not exists !"))
        }

        const isMatch = await bcrypt.compare(password,user.password!)

        if(!isMatch){
            return next(new ValidationError("Invalid email and password"))
        }
        

        const accessToken = jwt.sign({id: user.id,role:user.role,sessionId:sessionId,jti:jti},process.env.ACCESS_TOKEN_SECRET as string,{
            expiresIn:"15m"
        })

        const refreshToken = jwt.sign({id: user.id,role:"user",sessionId:sessionId,jti:jti},process.env.REFRESH_TOKEN_SECRET as string,{
            expiresIn:"7d"
        })

        setCookie(res,"refresh_token",refreshToken)
        setCookie(res,"access_token",accessToken)


        await redis.set(`session:${sessionId}`,JSON.stringify({
                        id: user.id,
                        role: user.role,
                        sessionId:sessionId,
                        jti:jti,
                        revoked: false
                            }),"EX",7*24*60*60)


        await publishUserLogin({
            key:user.id,
            value:user.name
        })

        res.status(200).json({
            message:"Login successful",
            user :  {id:user.id,email:user.email,name:user.name}
        })

    }catch(error){

        return next(error);
    }
}


export const logoutUser =  async (req:any,res:Response,next:NextFunction) => {

      try {
            const refreshToken = req.cookies["refresh_token"]

            if(refreshToken){
                const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET as string) as jwt.JwtPayload
                if(decoded.sessionId){
                    await redis.del(`session:${decoded.sessionId}`)
                     await publishUserLogout({
                        key:decoded.id,
                        data:decoded.id
                       })
                }
            }   

            clearCookie(res,"refresh_token","/");
            clearCookie(res,"access_token","/");

           

            res.status(200).json({
                message:"Logout successful",
            })
        
    }catch(error){

        return next(error);
    }
    
}

export const refreshToken = async (req:any,res:Response,next:NextFunction) => {
    try {
        const refreshToken = req.cookies["refresh_token"] || req.headers.authorization?.split(" ")[1];

        if(!refreshToken){
            throw new ValidationError("Unauthorized ! No refresh token !")
        }

        const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET as string) as {id:string,role:string}

        if(!decoded || !decoded.id || !decoded.role){
            return new JsonWebTokenError("Forbidden ! Invalid refresh token !");
        }

        let account = await prisma.users.findUnique({where:{id:decoded.id}})
        
        
        if(!account){
            return new AuthError("Forbidden ! User not found !")
        }

        const newAccessToken = jwt.sign({id:decoded.id,role:decoded.role},process.env.ACCESS_TOKEN_SECRET as string,{expiresIn:"15m"})
        
        setCookie(res,"access_token",newAccessToken);

        return res.status(201).json({success:true})

    }catch(error){
        return next(error);
    }
}