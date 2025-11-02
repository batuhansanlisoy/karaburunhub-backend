// src/controllers/UserController.ts
import { Request, Response } from "express";
import { UserService } from "../Service/User";
import { User } from "../Entity/User";

const userService = new UserService();

export const listUsers = async (req: Request, res: Response) => {
    try {
        const users: User[] = await userService.listUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err });
    }
    };

    export const addUser = async (req: Request, res: Response) => {
    try {
        const user: User = req.body;
        await userService.addUser(user);
        res.status(201).json({ message: "User created" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
