import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs:15*60*1000,
  //max: (req:any)=>(req.user ? 1000 : 100), 
  max:2000,
  message:{error:"Too many request, please try again later"},
  standardHeaders:true,
  legacyHeaders:true,
  keyGenerator: (req:any)=> ipKeyGenerator(req.ip) // spesifik ip için rate limiter ekle,

});
