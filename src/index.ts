import express, { Express, Request, Response } from "express";
import { startServer } from "./Helper/startServer";
import { UserClient } from "./Services/UserService/UserClient";
import { verifyToken } from "./middlewares/authMiddleware";
import { authRouter } from "./Routes/auth";
import dotenv from "dotenv";
import { roomRouter } from "./Routes/room";
declare global {
  namespace Express {
    interface Request {
      username?: string;
    }
  }
}
const app: Express = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
dotenv.config();
const port = process.env.PORT;
app.get("/api/v0.1/health", async (req: Request, res: Response) => {
  res.status(200).json("Pong!");
});
app.use("/api/v0.1/auth", authRouter);
app.use("/api/v0.1/room", roomRouter);
app.listen(port, async () => startServer(Number(port)));
