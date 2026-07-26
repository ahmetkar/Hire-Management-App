import { Request,Response,NextFunction } from "express";
import {requestCounter,requestHistogram} from "@hrmanagement/metrics"


export function requestDuration(req:Request,res:Response,next:NextFunction){

    const end = requestHistogram.startTimer();
      
        res.on("finish", () => {
            requestCounter.inc({
            method: req.method,
            route: req.route?.path ?? req.path,
            status: String(res.statusCode)
            });
            end({
                method: req.method,
                route: req.path,
                status: res.statusCode,
            });
    });

    next();
}