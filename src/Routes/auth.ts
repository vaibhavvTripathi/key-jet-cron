import express, { Express, Request, Response } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { UserClient } from "../Services/UserService/UserClient";
import { KeyJetError } from "../Models/KeyJetError";
export const authRouter = express.Router();

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(401).json("Unauthorised user");
    return res.status(200).json(await UserClient.login(username, password));
  } catch (error) {
    if (error instanceof KeyJetError) {
      return res.status(error.statusCode).json(error.message);
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
});
authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(401).json("Unauthorised user");
    return res.status(200).json(await UserClient.register({ username, password }));
  } catch (error) {
    if (error instanceof KeyJetError) {
      return res.status(error.statusCode).json(error.message);
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
});
