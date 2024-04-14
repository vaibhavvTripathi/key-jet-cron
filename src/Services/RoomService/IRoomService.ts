import { IRoom, UserPerformance } from "../../Models/Room";

export interface IRoomService {
  getRoomData(roomId: string): Promise<IRoom>;
  createRoom(username: string): Promise<string>;
  postSelfPerformanceToRoom(
    userPerformance: UserPerformance,
    roomId: string,
    username : string
  ): Promise<void>;
  getResultsForRace(roomId: string): Promise<IRoom>;
  joinRoom(roomId: string, username: string): Promise<void>;
  getRacingHistory(username: string): Promise<Array<IRoom>>;
}
