import mongoose, { Schema } from "mongoose";

export type IRoom = {
  createTime: Date;
  startTime: Date | undefined | null;
  roomId: string;
  players: Array<Player>; // username against Userperformance
  currentStatus: RaceStatus;
};

export type Player = {
  username: string;
  performance: Array<UserPerformance>;
};

export enum RaceStatus {
  INITIALISED = 0, // HOST JOINED
  INTERMEDIATE = 1, // BOTH PLAYERS JOINED BUT WAITING
  STARTED = 2, // RACE STARTED
  ENDED = 3, // ISN'T IT OBVIOUS
  DEPRECATED = 4,
}

export type UserPerformance = {
  time: number;
  rawSpeed: number;
  wpm: number;
  accuracy: number;
  correctChar: number;
  incorrectChar: number;
  extraChar: number;
  missedChar: number;
};

const userPerformanceSchema = new Schema<UserPerformance>({
  time: { type: Number, required: true },
  rawSpeed: { type: Number, required: true },
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  correctChar: { type: Number, required: true },
  incorrectChar: { type: Number, required: true },
  extraChar: { type: Number, required: true },
  missedChar: { type: Number, required: true },
});
const playerSchema = new Schema<Player>({
  username: { type: String, required: true },
  performance: { type: [userPerformanceSchema], required: true },
});
const roomSchema = new Schema<IRoom>({
  createTime: { type: Date, required: true },
  startTime: Date,
  roomId: { type: String, required: true },
  players: [playerSchema],
  currentStatus: { type: Number, enum: [0, 1, 2, 3, 4], required: true },
});

export const Room = mongoose.model("Room", roomSchema);
