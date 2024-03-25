import express, { Express, Request, Response } from "express";
import { startServer } from "./Helper/startServer";
import { UserClient } from "./Services/UserService/UserClient";
import { verifyToken } from "./middlewares/authMiddleware";
import { authRouter } from "./Routes/auth";
import dotenv from "dotenv";
declare global {
  namespace Express {
    interface Request {
      username?: string;
    }
  }
}
const app: Express = express();
const port = 3080;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
dotenv.config();

app.get("/api/v0.1/health", async (req: Request, res: Response) => {
  res.status(200).json("Pong!");
});
app.use("/api/v0.1/auth",verifyToken, authRouter);
app.listen(port, async () => startServer(port));
