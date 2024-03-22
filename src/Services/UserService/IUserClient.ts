import  { AuthResponse, IUser } from "../../Models/User";

export interface IUserClient {
  getSelf(username: string): Promise<IUser>;
  login(username: string, password: string): Promise<AuthResponse>;
  register(user: IUser): Promise<AuthResponse>;
}
