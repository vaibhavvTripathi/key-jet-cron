import { IRoom } from "../Models/Room";

export const RaceHandleFactory = (): Map<string, IRoom> => {
  return new Map<string, IRoom>();
};
