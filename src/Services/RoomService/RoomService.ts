import { KeyJetError } from "../../Models/KeyJetError";
import { IRoom, RaceStatus, Room, UserPerformance } from "../../Models/Room";
import { RaceHandleFactory } from "../../RaceHandlerFactory/RaceHandleFactory";
import { v4 as guid } from "uuid";
import { IRoomService } from "./IRoomService";

const raceHandler = RaceHandleFactory();

export const RoomService: IRoomService = {
  createRoom: async function (username): Promise<IRoom> {
    try {
      const roomId = guid();
      const createTime = new Date();
      const room: IRoom = {
        roomId: roomId,
        createTime: createTime,
        players: [],
        currentStatus: RaceStatus.INITIALISED,
        startTime: undefined,
      };
      const newRoom = new Room(room);
      await newRoom.save();
      return room;
    } catch (err) {
      throw err;
    }
  },
  postSelfPerformanceToRoom: async function (
    userPerformance: UserPerformance,
    roomId: string,
    username: string
  ): Promise<void> {
    try {
      const room = raceHandler.get(roomId);
      if (!room) {
        throw new KeyJetError("No room was found", 404);
      }
      if (userPerformance.time >= 30) {
        room.currentStatus = RaceStatus.ENDED;
        await Room.findOneAndUpdate({ roomId }, room, { upsert: true });
      }
      const user = room?.players.find((p) => p.username === username);
      if (!user) {
        throw new KeyJetError("User is not available", 400);
      }
      user.performance.push(userPerformance);
    } catch (err) {
      throw err;
    }
  },
  getResultsForRace: function (roomId: string): Promise<IRoom> {
    throw new Error("Function not implemented.");
  },
  joinRoom: async function (roomId: string, username: string): Promise<void> {
    try {
      const room = await Room.findOne({ roomId: roomId });
      if (!room) {
        throw new KeyJetError("Room does not exists", 404);
      }
      const user = room.players.find((p) => p.username === username);
      if (user) {
        throw new KeyJetError("User already present", 409);
      }
      if (room.players.length == 1) {
        room.currentStatus = RaceStatus.INTERMEDIATE;
        room.startTime = new Date();
      }
      room.players.push({ username: username, performance: [] });
      raceHandler.set(roomId, room);
      await room.save();
    } catch (err) {
      throw err;
    }
  },
  getRoomData: async function (roomId: string): Promise<IRoom> {
    try {
      const room = raceHandler.get(roomId);
      if (!room) {
        throw new KeyJetError("Room does not exists", 404);
      }
      if(room.startTime) {
        const timeDiff = new Date().getTime()-new Date(room.startTime).getTime();
        if(timeDiff>10) {
          room.currentStatus = RaceStatus.STARTED;
        }
      }
      return room;
    } catch (err) {
      throw err;
    }
  },
  getRacingHistory: function (username: string): Promise<IRoom[]> {
    throw new Error("Function not implemented.");
  },
};
