import { NextFunction } from "express";


type Role = "staff" | "admin" | "user"

export const authorizeRoles = (roles:Role[]) => {
  return (req: any, res: any, next: NextFunction) => {


    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    return next();
  };
};