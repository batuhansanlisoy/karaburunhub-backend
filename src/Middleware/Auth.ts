import { Request, Response, NextFunction } from "express";

export const requireAuth = (req: any, res: any, next: NextFunction) => {
    if (req.session && req.session.isLoggedIn) {
        next();
    } else {
        res.redirect("/login");
    }
};