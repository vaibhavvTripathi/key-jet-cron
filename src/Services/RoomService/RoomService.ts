import { KeyJetError } from "../../Models/KeyJetError";
import { IRoom, Room, UserPerformance } from "../../Models/Room";
import { RaceHandleFactory } from "../../RaceHandlerFactory/RaceHandleFactory";
import { IRoomService } from "./IRoomService";

const raceHandler = RaceHandleFactory();
export const RoomService: IRoomService = {
  getRoomData: async function (roomId: string): Promise<IRoom> {
    try {
      if (raceHandler.has(roomId)) {
        return raceHandler.get(roomId) as IRoom;
      }
      const room = await Room.findOne({ roomId });
      if (!room) {
        throw new KeyJetError("Room by this roomId does not exist", 404);
      }
      raceHandler.set(roomId, room);
      return room;
    } catch (err) {
      throw err;
    }
  },
  postSelfPerformanceToRoom: async function (
    userPerformance: UserPerformance,
    roomId: string
  ): Promise<void> {
    try {
      if (!raceHandler.has(roomId)) {
        throw new KeyJetError("Room does not exist", 404);
      }
      if (userPerformance.time > 30) {
        await Room.findByIdAndUpdate({ roomId }, raceHandler.get(roomId), {
          upsert: true,
        });
      }
      raceHandler.get(roomId)?.players.push(userPerformance);
    } catch (err) {
      throw err;
    }
  },
  createRoom: function (hostUsername : string,): Promise<void> {
    try {
    
    }
    catch(err) {

    }
  },
};
