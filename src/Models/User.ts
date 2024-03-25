import mongoose, { Schema } from "mongoose";

export type IUser = {
  username: string;
  password: string;
  avatar?: Avatar;
}

export interface AuthResponse {
  username: string;
  token: string;
}
enum Avatar {
  SPEEDY = 0,
  FLASH = 1,
  FUME = 2,
  TORTY = 3,
}

// Schema
const schema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar : Number
});

const User = mongoose.model<IUser>("user", schema);

export default User;
