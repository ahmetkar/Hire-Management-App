export const verifyInternalRequest = (req: any, res: any, next: any) => {
  const internalKey = req.headers["x-internal-api-key"];

  if (internalKey !== process.env.INTERNAL_API_KEY) {
    return res.status(403).json({
      message: "Forbidden internal request"
    });
  }

  if (req.headers["x-user-id"]) {
    req.user = {
      id: req.headers["x-user-id"],
      role: req.headers["x-user-role"],
      sessionId: req.headers["x-session-id"]
    };
  }

  return next();
};