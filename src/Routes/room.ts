import express, { Express, Request, Response } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { UserClient } from "../Services/UserService/UserClient";
import { KeyJetError } from "../Models/KeyJetError";
import { RoomService } from "../Services/RoomService/RoomService";
export const roomRouter = express.Router();

roomRouter.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
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
roomRouter.get("/:roomId", verifyToken, async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId;
    const room = await RoomService.getRoomData(roomId);
    res.status(200).json(room);
  } catch (error) {
    if (error instanceof KeyJetError) {
      res.status(error.statusCode).json(error.message);
    } else {
      res.status(500).json("Internal Server Error");
    }
  }
});
roomRouter.post(
  "/user/:roomId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const roomId = req.params.roomId;
      const username = req.username;
      if (!username) {
        res.status(401).json("UNAUTHORIZED");
        return;
      }
      await RoomService.joinRoom(roomId, username);
      res.status(200).json("Joined room successfully");
    } catch (error) {
      if (error instanceof KeyJetError) {
        res.status(error.statusCode).json(error.message);
      } else {
        res.status(500).json("Internal Server Error");
      }
    }
  }
);
