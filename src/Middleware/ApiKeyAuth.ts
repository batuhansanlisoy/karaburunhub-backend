import { Request, Response, NextFunction } from "express";

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.header("X-API-KEY");
    const secretKey = process.env.MOBILE_API_KEY;

    if (apiKey && apiKey === secretKey) {
        next();
    } else {
        res.status(403).json({ message: "Yetkisiz erişim: API Key geçersiz." });
    }
};