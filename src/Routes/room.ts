import express, { Express, Request, Response } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { UserClient } from "../Services/UserService/UserClient";
import { KeyJetError } from "../Models/KeyJetError";
import { RoomService } from "../Services/RoomService/RoomService";
import { UserPerformance } from "../Models/Room";
export const roomRouter = express.Router();

roomRouter.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const response = await RoomService.createRoom(req.username as string);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof KeyJetError) {
      return res.status(error.statusCode).json(error.message);
    } else {
      return res.status(500).json("Internal Server Error");
    }
  }
});
roomRouter.get("/:roomId", verifyToken, async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId;
    const room = await RoomService.getRoomData(roomId);
    return res.status(200).json(room);
  } catch (error) {
    if (error instanceof KeyJetError) {
      return res.status(error.statusCode).json(error.message);
    } else {
      return res.status(500).json("Internal Server Error");
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
        return res.status(401).json("UNAUTHORIZED");
        return;
      }
      await RoomService.joinRoom(roomId, username);
      return res.status(200).json("Joined room successfully");
    } catch (error) {
      if (error instanceof KeyJetError) {
        return res.status(error.statusCode).json(error.message);
      } else {
        return res.status(500).json("Internal Server Error");
      }
    }
  }
);
roomRouter.get(
  "/results/:roomId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      console.log("here")
      const roomId = req.params.roomId;
      const username = req.username;
      if (!username) {
        return res.status(401).json("UNAUTHORIZED");
        return;
      }
      const finalRoomState = await RoomService.getResultsForRace(roomId);
      return res.status(200).json(finalRoomState);
    } catch (error) {
      if (error instanceof KeyJetError) {
        return res.status(error.statusCode).json(error.message);
      } else {
        return res.status(500).json("Internal Server Error");
      }
    }
  }
);
roomRouter.post(
  "/performance/:roomId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const roomId = req.params.roomId;
      const username = req.username;
      if (!username) {
        return res.status(401).json("UNAUTHORIZED");
        return;
      }
      const userPerformance: UserPerformance = req.body;
      await RoomService.postSelfPerformanceToRoom(
        userPerformance,
        roomId,
        username
      );
      return res.status(200).json("Performance posted successfully");
    } catch (error) {
      if (error instanceof KeyJetError) {
        return res.status(error.statusCode).json(error.message);
      } else {
        return res.status(500).json("Internal Server Error");
      }
    }
  }
);
roomRouter.get(
  "/history",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const username = req.username;
      if (!username) {
        return res.status(401).json("UNAUTHORIZED");
        return;
      }
      const history = await RoomService.getRacingHistory(username)
      return res.status(200).json(history);
    } catch (error) {
      if (error instanceof KeyJetError) {
        return res.status(error.statusCode).json(error.message);
      } else {
        return res.status(500).json("Internal Server Error");
      }
    }
  }
);