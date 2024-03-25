import { IRoom, UserPerformance } from "../../Models/Room";

export interface IRoomService {
  getRoomData(roomId: string): Promise<IRoom>;
  postSelfPerformanceToRoom(
    userPerformance: UserPerformance,
    roomId: string
  ): Promise<void>;
  createRoom(roomCreationPayload: IRoom): Promise<void>;
}
