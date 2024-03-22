import { authenticateUser, generateToken } from "../../Helper/authHelpers";
import { KeyJetError } from "../../Models/KeyJetError";
import User, { IUser } from "../../Models/User";
import { AuthResponse } from "../../Models/User";
import { IUserClient } from "./IUserClient";
import bcrypt from "bcrypt";

export const UserClient: IUserClient = {
  getSelf: async function (username: string): Promise<IUser> {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        throw new KeyJetError("User not found in the db", 404);
      }
      return { username: user.username, password: "", avatar: user.avatar };
    } catch (err) {
      throw err;
    }
  },
  login: async function (
    username: string,
    password: string
  ): Promise<AuthResponse> {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        throw new KeyJetError("User not found in the db", 400);
      }
      if (!(await authenticateUser(user.password, password))) {
        throw new KeyJetError("User is not authorised", 401);
      }
      const token = generateToken(user.username);
      return { username: user.username, token: token };
    } catch (err) {
      throw err;
    }
  },
  register: async function (userToBeRegistered: IUser): Promise<AuthResponse> {
    try {
      const user = await User.findOne({
        username: userToBeRegistered.username,
      });
      if (user) {
        throw new KeyJetError("User already registered", 409);
      }
      const hashedPassword = await bcrypt.hash(userToBeRegistered.password, 10);
      userToBeRegistered.password = hashedPassword;
      await User.create(userToBeRegistered);
      const token = generateToken(userToBeRegistered.username);
      return { username: userToBeRegistered.username, token: token };
    } catch (err) {
      throw err;
    }
  },
};
