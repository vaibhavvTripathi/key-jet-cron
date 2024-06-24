import { CronJob } from "cron";
import Redis from "ioredis";
import { IRoom, RaceStatus, Room } from "../Models/Room";
const redisClient = new Redis(process.env.REDIS_URI as string);
export const updateDbWithNewRoomData = CronJob.from({
  cronTime: "* * * * * *",
  onTick: async function () {
    const keys = await redisClient.keys("room*");
    const values = await Promise.all(keys.map((key) => redisClient.get(key)));
    values.forEach(async (v) => {
      const room = JSON.parse(v as string) as IRoom;
      console.log(room);
      if (room.currentStatus === RaceStatus.ENDED) await Room.updateOne(room);
    });
    const updatedKeys = keys.filter((key, index) => {
      const room = JSON.parse(values[index] as string) as IRoom;
      return room.currentStatus === RaceStatus.ENDED;
    });

    if (updatedKeys.length > 0) {
      await redisClient.del(updatedKeys);
      console.log(`Deleted ${updatedKeys.length} keys from Redis.`);
    } else {
      console.log("No keys to delete.");
    }
  },
  start: false,
  timeZone: "America/Los_Angeles",
});
