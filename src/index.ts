import { CronJob } from "cron";
import dotenv from "dotenv";
import dbConnect from "./Helper/dbConnect";
import Redis from "ioredis";
import { updateDbWithNewRoomData } from "./Jobs/RoomJobs";
dotenv.config();

const startup = async () => {
  await loadEssentialDependencies();
  await updateDbWithNewRoomData.start();
};

const loadEssentialDependencies = async () => {
  await dbConnect();
  console.log("setup done !!");
};
startup();
