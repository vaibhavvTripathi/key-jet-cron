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
        startTime: undefined
      };
      const newRoom = new Room(room);
      await newRoom.save();
      return room;
    } catch (err) {
      throw err;
    }
  },
  postSelfPerformanceToRoom: function (
    userPerformance: UserPerformance,
    roomId: string
  ): Promise<void> {
    throw new Error("Function not implemented.");
  },
  getResultsForRace: function (roomId: string): Promise<IRoom> {
    throw new Error("Function not implemented.");
  },
  joinRoom: async function (roomId: string, username: string): Promise<IRoom> {
    throw new Error("Function not implemented.");
  },
  getRoomData: function (roomId: string): Promise<IRoom> {
    throw new Error("Function not implemented.");
  },
  getRacingHistory: function (username: string): Promise<IRoom[]> {
    throw new Error("Function not implemented.");
  }
};
