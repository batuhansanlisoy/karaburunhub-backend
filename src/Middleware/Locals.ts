import { Response, NextFunction } from "express";

export const setLocals = (req: any, res: Response, next: NextFunction) => {
    res.locals.title = "KaraburunGO";
    res.locals.page = "";
    res.locals.isLoggedIn = req.session?.isLoggedIn || false;
    next();
};