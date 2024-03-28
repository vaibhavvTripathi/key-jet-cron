import express, { Express, Request, Response } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { UserClient } from "../Services/UserService/UserClient";
import { KeyJetError } from "../Models/KeyJetError";
import { RoomService } from "../Services/RoomService/RoomService";
export const roomRouter = express.Router();

roomRouter.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    console.log("working fine till here")
    const response = await RoomService.createRoom(req.username as string);
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof KeyJetError) {
      res.status(error.statusCode).json(error.message);
    } else {
      res.status(500).json("Internal Server Error");
    }
  }
});
roomRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) res.status(401).json("Unauthorised user");
    res.status(200).json(await UserClient.register({ username, password }));
  } catch (error) {
    if (error instanceof KeyJetError) {
      res.status(error.statusCode).json(error.message);
    } else {
      res.status(500).json("Internal Server Error");
    }
  }
});
