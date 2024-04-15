import { KeyJetError } from "../../Models/KeyJetError";
import { IRoom, RaceStatus, Room, UserPerformance } from "../../Models/Room";
import { RaceHandleFactory } from "../../RaceHandlerFactory/RaceHandleFactory";
import { v4 as guid } from "uuid";
import { IRoomService } from "./IRoomService";
import { error } from "console";

const raceHandler = RaceHandleFactory();

export const RoomService: IRoomService = {
  createRoom: async function (username): Promise<string> {
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
      raceHandler.set(roomId, room);
      return roomId;
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
      const user = room?.players.find((p) => p.username === username);
      if (!user) {
        throw new KeyJetError("User is not available", 400);
      }
      user.performance.push(userPerformance);
    } catch (err) {
      throw err;
    }
  },
  getResultsForRace: async function (roomId: string): Promise<IRoom> {
    try {
      const room = raceHandler.get(roomId);
      if (!room || room.currentStatus === RaceStatus.DEPRECATED) {
        throw new KeyJetError("Room doesn't exists", 404);
      }
      if (room.currentStatus !== RaceStatus.ENDED) {
        throw new KeyJetError("Race has not ended yet", 404);
      }
      await Room.findOneAndUpdate({ roomId: roomId }, room, { upsert: true });
      return room;
    } catch (err) {
      throw err;
    }
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
        room.startTime.setSeconds(room.startTime.getSeconds() + 10);
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
      if (room.currentStatus === RaceStatus.INITIALISED) {
        const timeDiff =
          new Date().getTime() - new Date(room.createTime).getTime();
        if (timeDiff >= 60000) {
          room.currentStatus = RaceStatus.DEPRECATED;
        }
      }
      if (room.startTime && room.currentStatus === RaceStatus.INTERMEDIATE) {
        const timeDiff =
          new Date(room.startTime).getTime() - new Date().getTime();
        if (timeDiff <= 0) {
          room.currentStatus = RaceStatus.STARTED;
        }
      }
      if (room.startTime && room.currentStatus === RaceStatus.STARTED) {
        const timeDiff =
          new Date().getTime() - new Date(room.startTime).getTime();
        if (timeDiff >= 30000) {
          room.currentStatus = RaceStatus.ENDED;
        }
      }
      return room;
    } catch (err) {
      throw err;
    }
  },
  getRacingHistory: async function (username: string): Promise<IRoom[]> {
    try {
      return await Room.find({ "players.username": username });
    } catch (err) {
      throw err;
    }
  },
};
